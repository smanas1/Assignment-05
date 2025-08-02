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
exports.checkBlocked = void 0;
const User_model_1 = require("../modules/user/User.model");
const checkBlocked = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized. Please log in." });
    }
    try {
        const user = yield User_model_1.User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found. " });
        }
        //  Allow admins even if blocked
        if (user.role === "admin") {
            return next();
        }
        // Block access if user or agent is blocked
        if (user.isBlocked) {
            return res.status(403).json({
                message: `Access denied. Your ${user.role === "agent"
                    ? "account has been suspended."
                    : "access has been blocked."} Please contact support for further assistance.`,
            });
        }
        next();
    }
    catch (err) {
        console.error("Block check error:", err);
        res
            .status(500)
            .json({ message: "Internal server error. Please try again later." });
    }
});
exports.checkBlocked = checkBlocked;
