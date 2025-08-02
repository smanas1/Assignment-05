"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userIdSchema = exports.agentTransactionSchema = exports.sendMoneySchema = exports.addMoneySchema = void 0;
const zod_1 = require("zod");
const auth_validator_1 = require("../auth/auth.validator");
exports.addMoneySchema = zod_1.z.object({
    amount: zod_1.z.number().positive("Amount must be positive"),
});
exports.sendMoneySchema = zod_1.z.object({
    receiverPhone: zod_1.z.string().regex(auth_validator_1.bangladeshPhoneRegex, "Invalid phone number"),
    amount: zod_1.z.number().positive("Amount must be positive"),
});
exports.agentTransactionSchema = zod_1.z.object({
    userPhone: zod_1.z.string().regex(auth_validator_1.bangladeshPhoneRegex, "Invalid phone number"),
    amount: zod_1.z.number().positive("Amount must be positive"),
});
exports.userIdSchema = zod_1.z.object({
    userId: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid user ID format"),
});
