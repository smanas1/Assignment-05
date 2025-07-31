import { Document, Schema, model } from "mongoose";

export interface IWallet extends Document {
  owner: Schema.Types.ObjectId;
  balance: number;

  createdAt: Date;
}

const walletSchema = new Schema<IWallet>({
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  balance: { type: Number, default: 50 },
  createdAt: { type: Date, default: Date.now },
});

export const Wallet = model<IWallet>("Wallet", walletSchema);
