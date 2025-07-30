import { Request, Response } from "express";
import { addMoneySchema, sendMoneySchema } from "./wallet.validator";
import { User } from "../user/User.model";
import { Transaction } from "../transaction/Transaction.model";

export const addMoney = async (req: Request, res: Response) => {
  try {
    const { amount } = addMoneySchema.parse(req.body);
    const userId = req.user!.userId;

    const user = await User.findById(userId).populate("wallet");
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.isBlocked)
      return res.status(403).json({ message: "Wallet is blocked" });

    const wallet = user.wallet as any;
    wallet.balance += amount;
    await wallet.save();

    await Transaction.create({
      type: "top-up",
      amount,
      wallet: wallet._id,
      description: "User added money",
    });

    res.json({ message: "Money added", balance: wallet.balance });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const withdrawMoney = async (req: Request, res: Response) => {
  try {
    const { amount } = addMoneySchema.parse(req.body);
    const userId = req.user!.userId;

    const user = await User.findById(userId).populate("wallet");
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.isBlocked)
      return res.status(403).json({ message: "Wallet is blocked" });

    const wallet = user.wallet as any;
    if (wallet.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    wallet.balance -= amount;
    await wallet.save();

    await Transaction.create({
      type: "withdraw",
      amount,
      wallet: wallet._id,
      description: "User withdrew money",
    });

    res.json({ message: "Withdrawn", balance: wallet.balance });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const sendMoney = async (req: Request, res: Response) => {
  try {
    const { receiverPhone, amount } = sendMoneySchema.parse(req.body);
    const senderId = req.user!.userId;

    const sender = await User.findById(senderId).populate("wallet");
    const receiver = await User.findOne({ phone: receiverPhone }).populate(
      "wallet"
    );

    if (!sender || !receiver)
      return res.status(404).json({ message: "User not found" });
    if (sender.isBlocked || receiver.isBlocked)
      return res.status(403).json({ message: "One wallet is blocked" });

    const senderWallet = sender.wallet as any;
    const receiverWallet = receiver.wallet as any;

    if (senderWallet.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    senderWallet.balance -= amount;
    receiverWallet.balance += amount;

    await senderWallet.save();
    await receiverWallet.save();

    await Transaction.create({
      type: "send-money",
      amount,
      sender: sender._id,
      receiver: receiver._id,
      wallet: senderWallet._id,
      description: `Sent to ${receiver.phone}`,
    });

    await Transaction.create({
      type: "receive",
      amount,
      sender: sender._id,
      receiver: receiver._id,
      wallet: receiverWallet._id,
      description: `Received from ${sender.phone}`,
    });

    res.json({ message: "Money sent", balance: senderWallet.balance });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getTransactions = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const transactions = await Transaction.find({ wallet: user.wallet })
      .populate("sender receiver", "name email")
      .sort({ createdAt: -1 });

    res.json(transactions);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
