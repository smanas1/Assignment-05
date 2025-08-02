"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const zod_1 = require("zod");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const envSchema = zod_1.z.object({
    PORT: zod_1.z.string().default("5000"),
    MONGO_URI: zod_1.z.string().url().min(1, "MONGO_URI is required"),
    JWT_SECRET: zod_1.z.string().min(1, "JWT_SECRET is required"),
    JWT_EXPIRES_IN: zod_1.z.string().default("7d"),
    CASH_IN_COMMISSION: zod_1.z.string().default("0.02"),
    CASH_OUT_COMMISSION: zod_1.z.string().default("0.020"),
    BCRYPT_SALT_ROUNDS: zod_1.z
        .string()
        .regex(/^\d+$/, "BCRYPT_SALT_ROUNDS must be a number"),
});
const parsedEnv = envSchema.safeParse(process.env);
if (!parsedEnv.success) {
    console.error("Invalid environment variables:", parsedEnv.error.format());
    process.exit(1);
}
exports.env = {
    PORT: parseInt(parsedEnv.data.PORT, 10),
    MONGO_URI: parsedEnv.data.MONGO_URI,
    JWT_SECRET: parsedEnv.data.JWT_SECRET,
    JWT_EXPIRES_IN: parsedEnv.data.JWT_EXPIRES_IN,
    BCRYPT_SALT_ROUNDS: parseInt(parsedEnv.data.BCRYPT_SALT_ROUNDS, 10),
    CASH_IN_COMMISSION: parsedEnv.data.CASH_IN_COMMISSION,
    CASH_OUT_COMMISSION: parsedEnv.data.CASH_OUT_COMMISSION,
};
