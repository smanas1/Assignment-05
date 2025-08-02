/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { addMoneySchema, sendMoneySchema } from "./wallet.validator";
import { User } from "../user/User.model";
import { Transaction } from "../transaction/Transaction.model";
import { ObjectId } from "mongoose";

export const addMoney = async (req: Request, res: Response) => {
  try {
    const { amount } = addMoneySchema.parse(req.body);
    const userId = req.user!.userId;

    const user = await User.findById(userId).populate("wallet");
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.isBlocked)
      return res
        .status(403)
        .json({ message: "Your account is blocked. Cannot add money." });

    const wallet = user.wallet as any;
    wallet.balance += amount;
    await wallet.save();

    await Transaction.create({
      type: "top-up",
      amount,
      wallet: wallet._id,
      description: "User added money to wallet.",
    });

    res.json({ message: "Money added successfully.", balance: wallet.balance });
  } catch (err: any) {
    if (err.name === "ZodError") {
      const errors = err.errors.map((e: any) => ({
        field: e.path.join("."),
        message: e.message,
      }));
      return res.status(400).json({
        success: false,
        message: "Invalid input.",
        errors,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to add money. Please try again later.",
      error: err.message,
    });
  }
};

export const withdrawMoney = async (req: Request, res: Response) => {
  try {
    const { amount } = addMoneySchema.parse(req.body);
    const userId = req.user!.userId;

    const user = await User.findById(userId).populate("wallet");
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.isBlocked)
      return res
        .status(403)
        .json({ message: "Your account is blocked. Cannot withdraw money." });

    const wallet = user.wallet as any;
    if (wallet.balance < amount) {
      return res
        .status(400)
        .json({ message: "Insufficient balance for withdrawal." });
    }

    wallet.balance -= amount;
    await wallet.save();

    await Transaction.create({
      type: "withdraw",
      amount,
      wallet: wallet._id,
      description: "User withdrew money from wallet",
    });

    res.json({ message: "Withdrawal successful", balance: wallet.balance });
  } catch (err: any) {
    if (err.name === "ZodError") {
      const errors = err.errors.map((e: any) => ({
        field: e.path.join("."),
        message: e.message,
      }));
      return res.status(400).json({
        success: false,
        message: "Invalid input.",
        errors,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to process withdrawal.",
      error: err.message,
    });
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
      return res.status(403).json({
        message: "One of the accounts is blocked. Transaction not allowed",
      });

    if (
      (sender._id as ObjectId).toString() ===
      (receiver._id as ObjectId).toString()
    ) {
      return res
        .status(400)
        .json({ message: "You cannot send money to yourself" });
    }

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

    res.json({
      message: "Money sent successfully",
      balance: senderWallet.balance,
    });
  } catch (err: any) {
    if (err.name === "ZodError") {
      const errors = err.errors.map((e: any) => ({
        field: e.path.join("."),
        message: e.message,
      }));
      return res.status(400).json({
        success: false,
        message: "Invalid request data.",
        errors,
      });
    }

    res.status(500).json({
      success: false,
      message: "Transaction failed. Please try again later.",
      error: err.message,
    });
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

    res.status(200).json({
      success: true,
      message: "Transactions retrieved successfully.",
      transactions,
      count: transactions.length,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve transactions.",
      error: err.message,
    });
  }
};

// Get current user's wallet balance
export const getBalance = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;

    const user = await User.findById(userId).populate("wallet");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const wallet = user.wallet as any;
    res.status(200).json({
      success: true,
      message: "Balance retrieved successfully.",
      data: {
        balance: wallet.balance,

        updatedAt: wallet.updatedAt,
      },
    });
  } catch (err: any) {
    console.error("Balance fetch error:", err);
    res.status(500).json({
      success: false,
      message: "An error occurred while retrieving balance.",
    });
  }
};
