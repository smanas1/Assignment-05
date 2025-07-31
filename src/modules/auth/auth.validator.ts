import { z } from "zod";

export const bangladeshPhoneRegex = /^(\+880|0)1[3-9]\d{8}$/;

export const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z
    .string()
    .regex(bangladeshPhoneRegex, "Invalid Bangladeshi phone number"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["user", "agent"]).optional().default("user"),
});

export const loginSchema = z.object({
  phone: z.string().regex(bangladeshPhoneRegex, "Invalid phone number"),
  password: z.string().min(1, "Password required"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
