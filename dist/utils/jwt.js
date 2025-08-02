"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const secret = env_1.env.JWT_SECRET;
if (!secret) {
    throw new Error("JWT_SECRET is not defined. Please set it in .env");
}
const generateToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, secret, { expiresIn: "3d" });
};
exports.generateToken = generateToken;
const verifyToken = (token) => {
    return jsonwebtoken_1.default.verify(token, secret);
};
exports.verifyToken = verifyToken;
