import { Request, Response } from "express";
import { agentTransactionSchema } from "../wallet/wallet.validator";
import { User } from "../user/User.model";
import { Transaction } from "../transaction/Transaction.model";

export const cashIn = async (req: Request, res: Response) => {
  try {
    const { userPhone, amount } = agentTransactionSchema.parse(req.body);
    const agentId = req.user!.userId;

    const user = await User.findOne({ phone: userPhone }).populate("wallet");
    const agent = await User.findById(agentId);

    if (!user || !agent)
      return res.status(404).json({ message: "User or agent not found" });
    if (user.isBlocked)
      return res.status(403).json({ message: "User wallet is blocked" });

    const wallet = user.wallet as any;
    wallet.balance += amount;
    await wallet.save();

    const commission = amount * 0.01; // 1% commission

    await Transaction.create({
      type: "cash-in",
      amount,
      sender: agent._id,
      receiver: user._id,
      wallet: wallet._id,
      description: `Cash-in by agent ${agent.name}`,
      commission,
    });

    res.json({
      message: "Cash-in successful",
      balance: wallet.balance,
      commission,
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const cashOut = async (req: Request, res: Response) => {
  try {
    const { userPhone, amount } = agentTransactionSchema.parse(req.body);
    const agentId = req.user!.userId;

    const user = await User.findOne({ phone: userPhone }).populate("wallet");
    const agent = await User.findById(agentId);

    if (!user || !agent)
      return res.status(404).json({ message: "User or agent not found" });
    if (user.isBlocked)
      return res.status(403).json({ message: "User wallet is blocked" });

    const wallet = user.wallet as any;
    if (wallet.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    wallet.balance -= amount;
    await wallet.save();

    const commission = amount * 0.015; // 1.5% commission

    await Transaction.create({
      type: "cash-out",
      amount,
      sender: user._id,
      receiver: agent._id,
      wallet: wallet._id,
      description: `Cash-out by agent ${agent.name}`,
      commission,
    });

    res.json({
      message: "Cash-out successful",
      balance: wallet.balance,
      commission,
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
