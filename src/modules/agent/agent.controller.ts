/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { agentTransactionSchema } from "../wallet/wallet.validator";
import { IUser, User } from "../user/User.model";
import { Transaction } from "../transaction/Transaction.model";
import { HydratedDocument } from "mongoose";
import { Wallet } from "../wallet/Wallet.model";
import { env } from "../../config/env";

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

    const commission = amount * parseInt(env.CASH_IN_COMMISSION);

    const agentWallet = await Wallet.findById(agent.wallet);
    if (!agentWallet) {
      return res.status(404).json({ message: "Agent wallet not found" });
    }
    agentWallet.balance += commission;
    await agentWallet.save();

    await Transaction.create({
      type: "cash-in",
      amount,
      sender: agent._id,
      receiver: user._id,
      wallet: wallet._id,
      description: `Cash-in by agent ${agent.name}`,
      commission,
    });
    //  Record commission income for agent
    await Transaction.create({
      type: "commission-earned",
      amount: commission,
      sender: user._id,
      receiver: agent._id,
      wallet: agentWallet._id,
      description: `Commission from cash-in (${amount})`,
      commission: 0,
    });

    res.json({
      message: "Cash-in successful",
      balance: wallet.balance,
      commission,
      agentWalletBalance: agentWallet.balance,
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

    const commission = amount * parseInt(env.CASH_OUT_COMMISSION);

    // Add commission to agent's wallet
    const agentWallet = await Wallet.findById(agent.wallet);
    if (!agentWallet) {
      return res.status(404).json({ message: "Agent wallet not found" });
    }

    agentWallet.balance += commission;
    await agentWallet.save();

    await Transaction.create({
      type: "cash-out",
      amount,
      sender: user._id,
      receiver: agent._id,
      wallet: wallet._id,
      description: `Cash-out by agent ${agent.name}`,
      commission,
    });

    //  Record commission income
    await Transaction.create({
      type: "commission-earned",
      amount: commission,
      sender: user._id,
      receiver: agent._id,
      wallet: agentWallet._id,
      description: `Commission from cash-out (${amount})`,
    });

    res.json({
      message: "Cash-out successful",
      balance: wallet.balance,
      commission,
      agentWalletBalance: agentWallet.balance,
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
// Commission History Endpoint
export const getCommissionHistory = async (req: Request, res: Response) => {
  try {
    const agentId = req.user!.userId;
    const agent = await User.findById(agentId).populate("wallet");

    if (!agent) return res.status(404).json({ message: "Agent not found" });

    const populatedAgent = agent as HydratedDocument<IUser> & {
      wallet: { _id: string };
    };
    console.log(populatedAgent);
    const transactions = await Transaction.find({
      wallet: populatedAgent.wallet._id,
      type: "commission-earned",
    }).sort({ createdAt: -1 });

    res.json(transactions);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
