import mongoose, { Schema } from "mongoose";

// Define categories schema
const categoriesSchema = new Schema(
  {

    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  },
);


// Export the categories model
const Categories = mongoose.models.Categories || mongoose.model("Categories", categoriesSchema);
export default Categories;