import mongoose from "mongoose";

let isConnected = false; // Track the connection status

const connectMongoDB = async () => {
  if (isConnected) {
    console.log("Already connected to MongoDB.");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);

    isConnected = true;
    console.log("Connected to MongoDB.");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw new Error("Couldn't connect to MongoDB: " + error.message);
  }
};

export default connectMongoDB;
