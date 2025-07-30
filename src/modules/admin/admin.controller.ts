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

export const toggleBlockUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user || user.role === "admin")
    return res.status(404).json({ message: "User not found" });

  user.isBlocked = !user.isBlocked;
  await user.save();

  res.json({ message: `User ${user.isBlocked ? "blocked" : "unblocked"}` });
};

export const toggleSuspendAgent = async (req: Request, res: Response) => {
  const { id } = req.params;
  const agent = await User.findById(id);
  if (!agent || agent.role !== "agent")
    return res.status(404).json({ message: "Agent not found" });

  agent.isBlocked = !agent.isBlocked;
  await agent.save();

  res.json({ message: `Agent ${agent.isBlocked ? "suspended" : "activated"}` });
};
