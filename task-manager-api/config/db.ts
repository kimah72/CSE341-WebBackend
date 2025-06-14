import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("MongoDB connected");
  } catch (error: unknown) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};