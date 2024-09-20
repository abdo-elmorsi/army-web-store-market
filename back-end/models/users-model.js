import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";

// Define user schema
const usersSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      unique: true,
    },
    phone: {
      type: String,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    role: {
      type: String,
      enum: ["admin", "store", "market"],
      default: "admin", // Default role if not provided
    },
    img: {
      type: String,
    },
  },
  {
    timestamps: true, // Adds `createdAt` and `updatedAt`
  },
);

// Hash password before saving the user
usersSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    return next(error); // Pass error to the next middleware
  }
});

// Compare passwords for login
usersSchema.methods.comparePassword = async function (enteredPassword) {
  try {
    return await bcrypt.compare(enteredPassword, this.password);
  } catch (error) {
    throw new Error("Error comparing passwords"); // Provide a meaningful error message
  }
};

// Export the user model
const Users = mongoose.models.Users || mongoose.model("Users", usersSchema);

export default Users;
