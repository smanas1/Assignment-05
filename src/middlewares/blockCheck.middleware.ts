/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response, NextFunction } from "express";
import { User } from "../modules/user/User.model";

export const checkBlocked = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized. Please log in." });
  }

  try {
    const user = await User.findById(userId);
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
        message: `Access denied. Your ${
          user.role === "agent"
            ? "account has been suspended."
            : "access has been blocked."
        } Please contact support for further assistance.`,
      });
    }

    next();
  } catch (err) {
    console.error("Block check error:", err);
    res
      .status(500)
      .json({ message: "Internal server error. Please try again later." });
  }
};
