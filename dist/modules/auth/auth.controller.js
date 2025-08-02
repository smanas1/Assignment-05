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
exports.login = exports.register = void 0;
const auth_validator_1 = require("./auth.validator");
const User_model_1 = require("../user/User.model");
const hash_1 = require("../../utils/hash");
const Wallet_model_1 = require("../wallet/Wallet.model");
const jwt_1 = require("../../utils/jwt");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, phone, password, role } = auth_validator_1.registerSchema.parse(req.body);
        const existingUser = yield User_model_1.User.findOne({ phone: phone });
        if (existingUser) {
            return res
                .status(400)
                .json({ message: "Phone number already registered" });
        }
        const hashedPassword = yield (0, hash_1.hashPassword)(password);
        const user = new User_model_1.User({
            name,
            phone: phone,
            password: hashedPassword,
            role,
        });
        yield user.save();
        const wallet = new Wallet_model_1.Wallet({ owner: user._id });
        yield wallet.save();
        user.wallet = wallet._id;
        yield user.save();
        const token = (0, jwt_1.generateToken)({
            userId: user._id,
            role: user.role,
        });
        res.cookie("token", token, { httpOnly: true });
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: { id: user._id, name, phone: phone, role },
        });
    }
    catch (err) {
        // Handle Zod validation errors
        if (err.name === "ZodError") {
            const errors = err.errors.map((e) => ({
                field: e.path.join("."),
                message: e.message,
            }));
            return res.status(400).json({
                success: false,
                message: "Validation failed.",
                errors,
            });
        }
        res.status(500).json({
            success: false,
            message: "Registration failed. Please try again later.",
        });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { phone, password } = auth_validator_1.loginSchema.parse(req.body);
        const user = yield User_model_1.User.findOne({ phone: phone }).populate("wallet");
        if (!user)
            return res.status(404).json({ message: "User not found" });
        const isMatch = yield (0, hash_1.comparePassword)(password, user.password);
        if (!isMatch)
            return res
                .status(401)
                .json({ message: "Invalid phone number or password." });
        if (user.isBlocked && user.role !== "admin") {
            return res.status(403).json({
                message: "Your account has been blocked. Please contact support.",
            });
        }
        const token = (0, jwt_1.generateToken)({
            userId: user._id,
            role: user.role,
        });
        res.cookie("token", token, { httpOnly: true });
        res.json({
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                phone: user.phone,
                role: user.role,
                isBlocked: user.isBlocked,
                wallet: user.wallet,
            },
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
                message: "Invalid request format.",
                errors,
            });
        }
        res.status(500).json({
            success: false,
            message: "Login failed. Please try again later.",
        });
    }
});
exports.login = login;
