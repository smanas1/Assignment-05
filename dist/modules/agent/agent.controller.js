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
exports.getCommissionHistory = exports.cashOut = exports.cashIn = void 0;
const wallet_validator_1 = require("../wallet/wallet.validator");
const User_model_1 = require("../user/User.model");
const Transaction_model_1 = require("../transaction/Transaction.model");
const Wallet_model_1 = require("../wallet/Wallet.model");
const env_1 = require("../../config/env");
const cashIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userPhone, amount } = wallet_validator_1.agentTransactionSchema.parse(req.body);
        const agentId = req.user.userId;
        const user = yield User_model_1.User.findOne({ phone: userPhone }).populate("wallet");
        const agent = yield User_model_1.User.findById(agentId);
        if (!user || !agent)
            return res.status(404).json({ message: "User or agent not found" });
        if (user.isBlocked)
            return res.status(403).json({ message: "User wallet is blocked" });
        const wallet = user.wallet;
        wallet.balance += amount;
        yield wallet.save();
        const commission = amount * parseInt(env_1.env.CASH_IN_COMMISSION);
        const agentWallet = yield Wallet_model_1.Wallet.findById(agent.wallet);
        if (!agentWallet) {
            return res.status(404).json({ message: "Agent wallet not found" });
        }
        agentWallet.balance += commission;
        yield agentWallet.save();
        yield Transaction_model_1.Transaction.create({
            type: "cash-in",
            amount,
            sender: agent._id,
            receiver: user._id,
            wallet: wallet._id,
            description: `Cash-in by agent ${agent.name}`,
            commission,
        });
        //  Record commission income for agent
        yield Transaction_model_1.Transaction.create({
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
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.cashIn = cashIn;
const cashOut = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userPhone, amount } = wallet_validator_1.agentTransactionSchema.parse(req.body);
        const agentId = req.user.userId;
        const user = yield User_model_1.User.findOne({ phone: userPhone }).populate("wallet");
        const agent = yield User_model_1.User.findById(agentId);
        if (!user || !agent)
            return res.status(404).json({ message: "User or agent not found" });
        if (user.isBlocked)
            return res.status(403).json({ message: "User wallet is blocked" });
        const wallet = user.wallet;
        if (wallet.balance < amount) {
            return res.status(400).json({ message: "Insufficient balance" });
        }
        wallet.balance -= amount;
        yield wallet.save();
        const commission = amount * parseInt(env_1.env.CASH_OUT_COMMISSION);
        // Add commission to agent's wallet
        const agentWallet = yield Wallet_model_1.Wallet.findById(agent.wallet);
        if (!agentWallet) {
            return res.status(404).json({ message: "Agent wallet not found" });
        }
        agentWallet.balance += commission;
        yield agentWallet.save();
        yield Transaction_model_1.Transaction.create({
            type: "cash-out",
            amount,
            sender: user._id,
            receiver: agent._id,
            wallet: wallet._id,
            description: `Cash-out by agent ${agent.name}`,
            commission,
        });
        //  Record commission income
        yield Transaction_model_1.Transaction.create({
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
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.cashOut = cashOut;
// Commission History Endpoint
const getCommissionHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const agentId = req.user.userId;
        const agent = yield User_model_1.User.findById(agentId).populate("wallet");
        if (!agent)
            return res.status(404).json({ message: "Agent not found" });
        const populatedAgent = agent;
        console.log(populatedAgent);
        const transactions = yield Transaction_model_1.Transaction.find({
            wallet: populatedAgent.wallet._id,
            type: "commission-earned",
        }).sort({ createdAt: -1 });
        res.json(transactions);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.getCommissionHistory = getCommissionHistory;
