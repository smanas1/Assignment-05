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
exports.getBalance = exports.getTransactions = exports.sendMoney = exports.withdrawMoney = exports.addMoney = void 0;
const wallet_validator_1 = require("./wallet.validator");
const User_model_1 = require("../user/User.model");
const Transaction_model_1 = require("../transaction/Transaction.model");
const addMoney = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { amount } = wallet_validator_1.addMoneySchema.parse(req.body);
        const userId = req.user.userId;
        const user = yield User_model_1.User.findById(userId).populate("wallet");
        if (!user)
            return res.status(404).json({ message: "User not found" });
        if (user.isBlocked)
            return res
                .status(403)
                .json({ message: "Your account is blocked. Cannot add money." });
        const wallet = user.wallet;
        wallet.balance += amount;
        yield wallet.save();
        yield Transaction_model_1.Transaction.create({
            type: "top-up",
            amount,
            wallet: wallet._id,
            description: "User added money to wallet.",
        });
        res.json({ message: "Money added successfully.", balance: wallet.balance });
    }
    catch (err) {
        if (err.name === "ZodError") {
            const errors = err.errors.map((e) => ({
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
});
exports.addMoney = addMoney;
const withdrawMoney = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { amount } = wallet_validator_1.addMoneySchema.parse(req.body);
        const userId = req.user.userId;
        const user = yield User_model_1.User.findById(userId).populate("wallet");
        if (!user)
            return res.status(404).json({ message: "User not found" });
        if (user.isBlocked)
            return res
                .status(403)
                .json({ message: "Your account is blocked. Cannot withdraw money." });
        const wallet = user.wallet;
        if (wallet.balance < amount) {
            return res
                .status(400)
                .json({ message: "Insufficient balance for withdrawal." });
        }
        wallet.balance -= amount;
        yield wallet.save();
        yield Transaction_model_1.Transaction.create({
            type: "withdraw",
            amount,
            wallet: wallet._id,
            description: "User withdrew money from wallet",
        });
        res.json({ message: "Withdrawal successful", balance: wallet.balance });
    }
    catch (err) {
        if (err.name === "ZodError") {
            const errors = err.errors.map((e) => ({
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
});
exports.withdrawMoney = withdrawMoney;
const sendMoney = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { receiverPhone, amount } = wallet_validator_1.sendMoneySchema.parse(req.body);
        const senderId = req.user.userId;
        const sender = yield User_model_1.User.findById(senderId).populate("wallet");
        const receiver = yield User_model_1.User.findOne({ phone: receiverPhone }).populate("wallet");
        if (!sender || !receiver)
            return res.status(404).json({ message: "User not found" });
        if (sender.isBlocked || receiver.isBlocked)
            return res.status(403).json({
                message: "One of the accounts is blocked. Transaction not allowed",
            });
        if (sender._id.toString() ===
            receiver._id.toString()) {
            return res
                .status(400)
                .json({ message: "You cannot send money to yourself" });
        }
        const senderWallet = sender.wallet;
        const receiverWallet = receiver.wallet;
        if (senderWallet.balance < amount) {
            return res.status(400).json({ message: "Insufficient balance" });
        }
        senderWallet.balance -= amount;
        receiverWallet.balance += amount;
        yield senderWallet.save();
        yield receiverWallet.save();
        yield Transaction_model_1.Transaction.create({
            type: "send-money",
            amount,
            sender: sender._id,
            receiver: receiver._id,
            wallet: senderWallet._id,
            description: `Sent to ${receiver.phone}`,
        });
        yield Transaction_model_1.Transaction.create({
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
    }
    catch (err) {
        if (err.name === "ZodError") {
            const errors = err.errors.map((e) => ({
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
});
exports.sendMoney = sendMoney;
const getTransactions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.userId;
        const user = yield User_model_1.User.findById(userId);
        if (!user)
            return res.status(404).json({ message: "User not found" });
        const transactions = yield Transaction_model_1.Transaction.find({ wallet: user.wallet })
            .populate("sender receiver", "name email")
            .sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            message: "Transactions retrieved successfully.",
            transactions,
            count: transactions.length,
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve transactions.",
            error: err.message,
        });
    }
});
exports.getTransactions = getTransactions;
// Get current user's wallet balance
const getBalance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.userId;
        const user = yield User_model_1.User.findById(userId).populate("wallet");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const wallet = user.wallet;
        res.status(200).json({
            success: true,
            message: "Balance retrieved successfully.",
            data: {
                balance: wallet.balance,
                updatedAt: wallet.updatedAt,
            },
        });
    }
    catch (err) {
        console.error("Balance fetch error:", err);
        res.status(500).json({
            success: false,
            message: "An error occurred while retrieving balance.",
        });
    }
});
exports.getBalance = getBalance;
