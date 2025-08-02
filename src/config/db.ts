import mongoose from "mongoose";
import dotenv from "dotenv";
import { env } from "./env";

dotenv.config();

export const connectDB = async () => {
  try {
    await mongoose.connect(env.MONGO_URI!);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("DB connection error:", err);
    process.exit(1);
  }
};
