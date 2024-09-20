import Users from "back-end/models/users-model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Helper function to validate inputs
const validateUserInput = (username, password, res) => {
	if (!username || typeof username !== 'string' || username.trim() === '') {
		res.status(400).json({ message: "Username is required and must be a non-empty string." });
		return false;
	}
	if (!password || typeof password !== 'string' || password.trim() === '') {
		res.status(400).json({ message: "Password is required and must be a non-empty string." });
		return false;
	}
	return true;
};

// Register handler
export const handleRegister = async (username, password, role, res) => {
	if (!validateUserInput(username, password, res)) return;

	try {
		// Check if the user already exists
		const existingUser = await Users.findOne({ username });
		if (existingUser) {
			return res.status(400).json({ message: "Username already taken" });
		}

		// Create a new user
		const newUser = await Users.create({
			username,
			password,
			role: role || "store", // Default to "store" if no role is provided
		});

		// Create JWT token
		const token = jwt.sign({ userId: newUser._id, role: newUser.role }, process.env.JWT_SECRET, {
			expiresIn: "1h",
		});

		return res.status(201).json({
			message: "User registered successfully",
			token,
			user: {
				_id: newUser._id,
				username: newUser.username,
				role: newUser.role,
			},
		});
	} catch (error) {
		return res.status(500).json({ message: "Internal server error" });
	}
};

// Login handler
export const handleLogin = async (username, password, res) => {
	if (!validateUserInput(username, password, res)) return;

	try {
		// Find the user by username
		const user = await Users.findOne({ username });

		if (!user) {
			return res.status(400).json({ message: "Invalid username or password" });
		}


		// Check if the entered password matches the hashed password
		const isMatch = await user.comparePassword(password); // Use the comparePassword method

		if (!isMatch) {
			return res.status(400).json({ message: "Invalid username or password" });
		}

		// Create JWT token with role information
		const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
			expiresIn: "1h",
		});

		return res.status(200).json({
			message: "Login successful",
			token,
			user: {
				_id: user._id,
				username: user.username,
				role: user.role,
				img: user.img,
			},
		});
	} catch (error) {
		return res.status(500).json({ message: "Internal server error" });
	}
};
