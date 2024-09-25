import mongoose, { Schema } from "mongoose";

// Define transaction schema
const transactionSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Products", // Reference to the product
      required: [true, "Product is required"],
    },
    type: {
      type: String,
      enum: [
        "storeIn",      // Stock added to the store
        "storeOut",     // Stock removed from the store
        "storeToMarket",     // Stock added to the market
        "marketToStore",    // Stock sold from the market
        "marketOut", // Stock moved from the store to the market
        "marketReturn"  // Stock moved from the market back to the store
      ], // Updated enum to include new transaction types
      required: [true, "Transaction type is required"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1"], // Optional: Ensure quantity is at least 1
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "Users", // Reference to the user who made the transaction
      required: [true, "User is required"],
    },
    date: {
      type: Date,
      default: Date.now,
      required: [true, "Date is required"],
    },
    description: {
      type: String, // Description field for additional information
      trim: true,
      default: "", // Default empty string if no description is provided
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  },
);

// Export the transactions model
const Transactions = mongoose.models.Transactions || mongoose.model("Transactions", transactionSchema);

export default Transactions;
