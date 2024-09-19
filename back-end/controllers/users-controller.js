import Users from "back-end/models/users-model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Helper function to validate username and password
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

// GET request handler for fetching all users or a single user
export const handleGetRequest = async (id, res) => {
  if (id) {
    const user = await Users.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  }

  const users = await Users.find({});
  return res.status(200).json(users);
};

// POST request handler for registering a user
export const handlePostRequest = async (username, password, role, img, res) => {
  if (!validateUserInput(username, password, res)) return;

  try {
    const existingUser = await Users.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const newUser = await Users.create({ username, password, role: role || "admin", img });

    const token = jwt.sign({ userId: newUser._id, role: newUser.role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        role: newUser.role,
        img: newUser.img,

      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// PUT request handler for updating a user
export const handlePutRequest = async (id, username, password, role, img, res) => {
  if (!id) {
    return res.status(400).json({ message: "ID is required for updating." });
  }

  if (username && (typeof username !== 'string' || username.trim() === '')) {
    return res.status(400).json({ message: "Username must be a non-empty string." });
  }

  if (password && (typeof password !== 'string' || password.trim() === '')) {
    return res.status(400).json({ message: "Password must be a non-empty string." });
  }

  try {
    const user = await Users.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user fields
    if (username) user.username = username;
    if (password) user.password = password;
    if (img) user.img = img;
    if (role) {
      const validRoles = ["admin", "store", "market"];
      if (!validRoles.includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }
      user.role = role;
    }

    await user.save();

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// DELETE request handler for deleting a user
export const handleDeleteRequest = async (id, res) => {
  if (!id) {
    return res.status(400).json({ message: "ID is required for deletion." });
  }

  try {
    const user = await Users.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
