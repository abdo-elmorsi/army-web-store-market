import mongoose, { Schema } from "mongoose";

const testSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required."], // Ensures the title is always present
      trim: true, // Removes any leading/trailing spaces
      minlength: [3, "Title must be at least 3 characters long."], // Validation for length
      maxlength: [100, "Title cannot exceed 100 characters."], // Validation for maximum length
    },
    description: {
      type: String,
      trim: true, // Removes any leading/trailing spaces
      default: "", // Default to an empty string if not provided
    },
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` timestamps
  }
);

// Adding an index to the title field to improve query performance if you search by title
testSchema.index({ title: 1 });

// Avoid re-compiling the model if it already exists
const Test = mongoose.models.Test || mongoose.model("Test", testSchema);

export default Test;
