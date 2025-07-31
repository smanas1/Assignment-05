import { Request, Response } from "express";
import { loginSchema, registerSchema } from "./auth.validator";
import { User } from "../user/User.model";
import { comparePassword, hashPassword } from "../../utils/hash";
import { Wallet } from "../wallet/Wallet.model";
import { generateToken } from "../../utils/jwt";
import { ObjectId } from "mongoose";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, phone, password, role } = registerSchema.parse(req.body);

    const existingUser = await User.findOne({ phone: phone });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Phone number already registered" });
    }

    const hashedPassword = await hashPassword(password);
    const user = new User({
      name,
      phone: phone,
      password: hashedPassword,
      role,
    });

    await user.save();

    const wallet = new Wallet({ owner: user._id });
    await wallet.save();

    user.wallet = wallet._id as ObjectId;
    await user.save();

    const token = generateToken({
      userId: user._id as string,
      role: user.role,
    });
    res.cookie("token", token, { httpOnly: true });

    res.status(201).json({
      message: "User registered successfully",
      user: { id: user._id, name, phone: phone, role },
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
export const login = async (req: Request, res: Response) => {
  try {
    const { phone, password } = loginSchema.parse(req.body);

    const user = await User.findOne({ phone: phone }).populate("wallet");
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    if (user.isBlocked && user.role !== "admin") {
      return res.status(403).json({ message: "Account is blocked" });
    }

    const token = generateToken({
      userId: user._id as string,
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
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
