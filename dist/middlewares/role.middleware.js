"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = void 0;
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user)
            return res.status(401).json({ message: "Unauthorized. Please log in." });
        if (req.user.role === "admin") {
            return next();
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: `You are not authorized to access this resource. Your role is ${req.user.role}.`,
            });
        }
        next();
    };
};
exports.authorize = authorize;
