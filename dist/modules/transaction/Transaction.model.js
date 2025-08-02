"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
const mongoose_1 = require("mongoose");
const transactionSchema = new mongoose_1.Schema({
    type: { type: String, required: true },
    amount: { type: Number, required: true },
    sender: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    receiver: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    wallet: { type: mongoose_1.Schema.Types.ObjectId, ref: "Wallet", required: true },
    description: { type: String },
    commission: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
});
exports.Transaction = (0, mongoose_1.model)("Transaction", transactionSchema);
