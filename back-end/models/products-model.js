import mongoose, { Schema } from "mongoose";

// Define product schema
const productsSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Categories", // Reference to Category model
      required: [true, "Category is required"],
    },
    quantityInStock: {
      type: Number,
      default: 0,
      required: [true, "Quantity in stock is required"],
      min: [0, "Quantity cannot be negative"], // Added validation
    },
    quantityInStore: { // New field for quantity in store
      type: Number,
      default: 0,
      min: [0, "Quantity in store cannot be negative"], // Added validation
    },
    quantityInMarket: { // New field for quantity in market
      type: Number,
      default: 0,
      min: [0, "Quantity in market cannot be negative"], // Added validation
    },
    unit: {
      type: Schema.Types.ObjectId,
      ref: "Units", // Reference to Unit of Measure model
      required: [true, "Unit of measure is required"],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "Users", // Reference to User model for who created the product
      required: true,
    },
    lastUpdatedBy: {
      type: Schema.Types.ObjectId,
      ref: "Users", // Reference to User model for who last updated the product
      required: true,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt timestamps
  },
);

// Custom validation to ensure stock quantities are logical
productsSchema.pre('save', function (next) {
  if (this.quantityInStore + this.quantityInMarket > this.quantityInStock) {
    return next(new Error("Total quantity in store and market cannot exceed quantity in stock"));
  }
  next();
});

// Export the products model
const Products = mongoose.models.Products || mongoose.model("Products", productsSchema);

export default Products;
