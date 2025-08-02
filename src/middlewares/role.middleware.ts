import { Request, Response, NextFunction } from "express";

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user)
      return res.status(401).json({ message: "Unauthorized. Please log in." });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `You are not authorized to access this resource. Your role is ${req.user.role}.`,
      });
    }
    next();
  };
};
