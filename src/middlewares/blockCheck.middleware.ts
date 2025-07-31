import { Request, Response, NextFunction } from "express";
import { User } from "../modules/user/User.model";

export const checkBlocked = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    //  Allow admins even if blocked (for recovery)
    if (user.role === "admin") {
      return next();
    }

    // Block access if user or agent is blocked
    if (user.isBlocked) {
      return res.status(403).json({
        message: `Access denied. Your account has been ${
          user.role === "agent" ? "suspended" : "blocked"
        }.`,
      });
    }

    next();
  } catch (err) {
    console.error("Block check error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
