import { Document, ObjectId } from "mongoose";

export interface IWallet extends Document {
  owner: ObjectId;
  balance: number;
  createdAt: Date;
}
