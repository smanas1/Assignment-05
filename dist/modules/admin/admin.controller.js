"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activateAgent = exports.suspendAgent = exports.unblockUser = exports.blockUser = exports.getAllTransactions = exports.getAllWallets = exports.getAllAgents = exports.getAllUsers = void 0;
const User_model_1 = require("../user/User.model");
const Wallet_model_1 = require("../wallet/Wallet.model");
const Transaction_model_1 = require("../transaction/Transaction.model");
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_model_1.User.find({ role: "user" }).select("-password");
        res.status(200).json({
            success: true,
            message: "Users retrieved successfully.",
            data: users,
            count: users.length,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve users.",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
exports.getAllUsers = getAllUsers;
const getAllAgents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const agents = yield User_model_1.User.find({ role: "agent" }).select("-password");
        res.status(200).json({
            success: true,
            message: "Agents retrieved successfully.",
            data: agents,
            count: agents.length,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve agents.",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
exports.getAllAgents = getAllAgents;
const getAllWallets = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const wallets = yield Wallet_model_1.Wallet.find().populate("owner", "name email");
        res.status(200).json({
            success: true,
            message: "Wallets retrieved successfully.",
            data: wallets,
            count: wallets.length,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve wallets.",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
exports.getAllWallets = getAllWallets;
const getAllTransactions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transactions = yield Transaction_model_1.Transaction.find().populate("sender receiver wallet", "name email balance");
        res.status(200).json({
            success: true,
            message: "Transactions retrieved successfully.",
            data: transactions,
            count: transactions.length,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve transactions.",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
exports.getAllTransactions = getAllTransactions;
const blockUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required.",
            });
        }
        const user = yield User_model_1.User.findById(userId);
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
        yield user.save();
        res.status(200).json({
            success: true,
            message: "User has been blocked successfully.",
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "An error occurred while blocking the user.",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
exports.blockUser = blockUser;
const unblockUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required.",
            });
        }
        const user = yield User_model_1.User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }
        user.isBlocked = false;
        yield user.save();
        res.json({
            success: true,
            message: "User has been unblocked successfully.",
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "An error occurred while unblocking the user.",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
exports.unblockUser = unblockUser;
const suspendAgent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "Agent ID is required.",
            });
        }
        const agent = yield User_model_1.User.findById(userId);
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
        yield agent.save();
        res.json({ success: true, message: "Agent suspended successfully" });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "An error occurred while suspending the agent.",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
exports.suspendAgent = suspendAgent;
const activateAgent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "Agent ID is required.",
            });
        }
        const agent = yield User_model_1.User.findById(userId);
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
        yield agent.save();
        res.status(200).json({
            success: true,
            message: "Agent has been reactivated successfully.",
            data: { userId: agent._id, name: agent.name },
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "An error occurred while activating the agent.",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
exports.activateAgent = activateAgent;
