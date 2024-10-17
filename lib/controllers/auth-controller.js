import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

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
export const handleRegister = async (data, res) => {
	const { username, password, role } = data;

	if (!validateUserInput(username, password, res)) return;

	try {
		// Check if the user already exists
		const existingUser = await prisma.user.findUnique({
			where: { username },
		});
		if (existingUser) {
			return res.status(400).json({ message: "Username already taken" });
		}

		// Hash the password before saving
		const hashedPassword = await bcrypt.hash(password, 10);

		// Create a new user
		const newUser = await prisma.user.create({
			data: {
				username,
				password: hashedPassword,
				role: role || "store", // Default to "store" if no role is provided
			},
		});

		// Create JWT token
		const token = jwt.sign({ userId: newUser.id, role: newUser.role }, process.env.JWT_SECRET, {
			expiresIn: "1h",
		});

		return res.status(201).json({
			message: "User registered successfully",
			token,
			user: {
				id: newUser.id,
				username: newUser.username,
				role: newUser.role,
			},
		});
	} catch (error) {
		return res.status(500).json({ message: error?.message || "Internal server error" });
	}
};

// Login handler
export const handleLogin = async (data, res) => {
	const { username, password } = data;
	if (!validateUserInput(username, password, res)) return;

	try {
		// Find the user by username
		const user = await prisma.user.findUnique({
			where: { username },
		});

		if (!user) {
			return res.status(400).json({ message: "Invalid username or password" });
		}

		// Check if the entered password matches the hashed password
		const isMatch = await bcrypt.compare(password, user.password);

		if (!isMatch) {
			return res.status(400).json({ message: "Invalid username or password" });
		}

		// Create JWT token with role information
		const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, {
			expiresIn: "1h",
		});

		return res.status(200).json({
			message: "Login successful",
			token,
			user: {
				id: user.id,
				username: user.username,
				role: user.role,
				phone: user.phone,
				img: user.img,
			},
		});
	} catch (error) {
		return res.status(500).json({ message: error?.message || "Internal server error" });
	}
};

// Update password handler
export const handleUpdatePassword = async (data, res) => {
	const { username, oldPassword, newPassword } = data;
	if (!validateUserInput(username, oldPassword, res) || !validateUserInput(username, newPassword, res)) return;

	try {
		const user = await prisma.user.findUnique({
			where: { username },
		});

		if (!user) {
			return res.status(400).json({ message: "User not found" });
		}

		const isMatch = await bcrypt.compare(oldPassword, user.password); // Compare with hashed password

		if (!isMatch) {
			return res.status(400).json({ message: "Old password is incorrect" });
		}

		// Hash the new password
		user.password = await bcrypt.hash(newPassword, 10);
		await prisma.user.update({
			where: { id: user.id },
			data: { password: user.password },
		}); // Save updated user

		return res.status(200).json({ message: "Password updated successfully" });
	} catch (error) {
		return res.status(500).json({ message: error?.message || "Internal server error" });
	}
};
