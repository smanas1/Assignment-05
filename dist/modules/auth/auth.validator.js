"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.registerSchema = exports.bangladeshPhoneRegex = void 0;
const zod_1 = require("zod");
exports.bangladeshPhoneRegex = /^(\+880|0)1[3-9]\d{8}$/;
exports.registerSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required"),
    phone: zod_1.z
        .string()
        .regex(exports.bangladeshPhoneRegex, "Invalid Bangladeshi phone number"),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters"),
    role: zod_1.z.enum(["user", "agent"]).optional().default("user"),
});
exports.loginSchema = zod_1.z.object({
    phone: zod_1.z.string().regex(exports.bangladeshPhoneRegex, "Invalid phone number"),
    password: zod_1.z.string().min(1, "Password required"),
});
