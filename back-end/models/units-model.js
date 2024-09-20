import mongoose, { Schema } from "mongoose";

// Define Units schema
const unitsSchema = new Schema(
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


// Export the Units model
const Units = mongoose.models.Units || mongoose.model("Units", unitsSchema);

export default Units;
