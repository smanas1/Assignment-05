import { Document, ObjectId } from "mongoose";

export interface IUser extends Document {
  name: string;
  phone: string;
  password: string;
  role: "user" | "agent" | "admin";
  isBlocked: boolean;
  wallet: ObjectId;
  createdAt: Date;
}
