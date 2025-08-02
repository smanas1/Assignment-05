import { Request, Response } from "express";
import { User } from "../user/User.model";
import { Wallet } from "../wallet/Wallet.model";
import { Transaction } from "../transaction/Transaction.model";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({ role: "user" }).select("-password");
    res.status(200).json({
      success: true,
      message: "Users retrieved successfully.",
      data: users,
      count: users.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve users.",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getAllAgents = async (req: Request, res: Response) => {
  try {
    const agents = await User.find({ role: "agent" }).select("-password");
    res.status(200).json({
      success: true,
      message: "Agents retrieved successfully.",
      data: agents,
      count: agents.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve agents.",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getAllWallets = async (req: Request, res: Response) => {
  try {
    const wallets = await Wallet.find().populate("owner", "name email");
    res.status(200).json({
      success: true,
      message: "Wallets retrieved successfully.",
      data: wallets,
      count: wallets.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve wallets.",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getAllTransactions = async (req: Request, res: Response) => {
  try {
    const transactions = await Transaction.find().populate(
      "sender receiver wallet",
      "name email balance"
    );
    res.status(200).json({
      success: true,
      message: "Transactions retrieved successfully.",
      data: transactions,
      count: transactions.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve transactions.",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const blockUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required.",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (user.role === "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin users cannot be blocked.",
      });
    }
    user.isBlocked = true;
    await user.save();

    res.status(200).json({
      success: true,
      message: "User has been blocked successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while blocking the user.",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const unblockUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required.",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    user.isBlocked = false;
    await user.save();

    res.json({
      success: true,
      message: "User has been unblocked successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while unblocking the user.",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const suspendAgent = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Agent ID is required.",
      });
    }

    const agent = await User.findById(userId);
    if (!agent) {
      return res.status(404).json({
        success: false,
        message: "Agent not found.",
      });
    }

    if (agent.role !== "agent") {
      return res.status(400).json({
        success: false,
        message: "Only agents can be suspended.",
      });
    }

    agent.isBlocked = true;
    await agent.save();

    res.json({ success: true, message: "Agent suspended successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while suspending the agent.",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const activateAgent = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Agent ID is required.",
      });
    }

    const agent = await User.findById(userId);
    if (!agent) {
      return res.status(404).json({
        success: false,
        message: "Agent not found.",
      });
    }

    if (agent.role !== "agent") {
      return res.status(400).json({
        success: false,
        message: "Only agents can be activated.",
      });
    }

    agent.isBlocked = false;
    await agent.save();

    res.status(200).json({
      success: true,
      message: "Agent has been reactivated successfully.",
      data: { userId: agent._id, name: agent.name },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while activating the agent.",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
