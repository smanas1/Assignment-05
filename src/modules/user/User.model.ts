import { Document, Schema, model } from "mongoose";

export interface IUser extends Document {
  name: string;
  phone: string;
  password: string;
  role: "user" | "agent" | "admin";
  isBlocked: boolean;
  wallet: Schema.Types.ObjectId;
  createdAt: Date;
}
const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "agent", "admin"], default: "user" },
  isBlocked: { type: Boolean, default: false },
  wallet: { type: Schema.Types.ObjectId, ref: "Wallet" },
  createdAt: { type: Date, default: Date.now },
});

export const User = model<IUser>("User", userSchema);
