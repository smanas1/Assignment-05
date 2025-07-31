import { Request, Response } from "express";
import { User } from "../user/User.model";
import { Wallet } from "../wallet/Wallet.model";
import { Transaction } from "../transaction/Transaction.model";

export const getAllUsers = async (req: Request, res: Response) => {
  const users = await User.find({ role: "user" }).select("-password");
  res.json(users);
};

export const getAllAgents = async (req: Request, res: Response) => {
  const agents = await User.find({ role: "agent" }).select("-password");
  res.json(agents);
};

export const getAllWallets = async (req: Request, res: Response) => {
  const wallets = await Wallet.find().populate("owner", "name email");
  res.json(wallets);
};

export const getAllTransactions = async (req: Request, res: Response) => {
  const transactions = await Transaction.find().populate(
    "sender receiver wallet",
    "name email balance"
  );
  res.json(transactions);
};

export const blockUser = async (req: Request, res: Response) => {
  const { userId } = req.body;

  const user = await User.findById(userId);
  if (!user || user.role === "admin") {
    return res
      .status(404)
      .json({ message: "User not found or cannot be blocked" });
  }

  user.isBlocked = true;
  await user.save();

  res.json({ message: "User blocked successfully" });
};

export const unblockUser = async (req: Request, res: Response) => {
  const { userId } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.isBlocked = false;
  await user.save();

  res.json({ message: "User unblocked successfully" });
};

export const suspendAgent = async (req: Request, res: Response) => {
  const { userId } = req.body;

  const agent = await User.findById(userId);
  if (!agent || agent.role !== "agent") {
    return res.status(404).json({ message: "Agent not found" });
  }

  agent.isBlocked = true;
  await agent.save();

  res.json({ message: "Agent suspended successfully" });
};

export const activateAgent = async (req: Request, res: Response) => {
  const { userId } = req.body;

  const agent = await User.findById(userId);
  if (!agent || agent.role !== "agent") {
    return res.status(404).json({ message: "Agent not found" });
  }

  agent.isBlocked = false;
  await agent.save();

  res.json({ message: "Agent activated successfully" });
};
