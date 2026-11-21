import mongoose from "mongoose";
import { logger } from "./logger";

export const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }

    await mongoose.connect(mongoURI);
    logger.info("MongoDB connected successfully");
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown database error";
    logger.error({ err: error }, `MongoDB connection failed: ${errorMessage}`);
    process.exit(1);
  }
};