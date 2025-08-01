import jwt from "jsonwebtoken";
import { JwtPayload } from "../types";
import { env } from "../config/env";

const secret = env.JWT_SECRET;

if (!secret) {
  throw new Error("JWT_SECRET is not defined. Please set it in .env");
}

export const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, secret, { expiresIn: "3d" });
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, secret) as JwtPayload;
};
