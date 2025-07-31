import { z } from "zod";
import { bangladeshPhoneRegex } from "../auth/auth.validator";

export const addMoneySchema = z.object({
  amount: z.number().positive("Amount must be positive"),
});

export const sendMoneySchema = z.object({
  receiverPhone: z.string().regex(bangladeshPhoneRegex, "Invalid phone number"),
  amount: z.number().positive("Amount must be positive"),
});

export const agentTransactionSchema = z.object({
  userPhone: z.string().regex(bangladeshPhoneRegex, "Invalid phone number"),
  amount: z.number().positive("Amount must be positive"),
});

export const userIdSchema = z.object({
  userId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid user ID format"),
});
