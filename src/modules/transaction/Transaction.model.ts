import { Document, Schema, model } from "mongoose";

export interface ITransaction extends Document {
  type:
    | "top-up"
    | "withdraw"
    | "send-money"
    | "receive"
    | "cash-in"
    | "cash-out";
  amount: number;
  sender?: Schema.Types.ObjectId;
  receiver?: Schema.Types.ObjectId;
  wallet: Schema.Types.ObjectId;
  description?: string;
  commission?: number;
  createdAt: Date;
}

const transactionSchema = new Schema<ITransaction>({
  type: { type: String, required: true },
  amount: { type: Number, required: true },
  sender: { type: Schema.Types.ObjectId, ref: "User" },
  receiver: { type: Schema.Types.ObjectId, ref: "User" },
  wallet: { type: Schema.Types.ObjectId, ref: "Wallet", required: true },
  description: { type: String },
  commission: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export const Transaction = model<ITransaction>(
  "Transaction",
  transactionSchema
);
