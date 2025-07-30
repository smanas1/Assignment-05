import { z } from "zod";

export const addMoneySchema = z.object({
  amount: z.number().positive("Amount must be positive"),
});

export const sendMoneySchema = z.object({
  receiverPhone: z
    .string()
    .regex(/^(\+?880|0)1[3-9]\d{8}$/, "Invalid phone number"),
  amount: z.number().positive("Amount must be positive"),
});

export const agentTransactionSchema = z.object({
  userPhone: z
    .string()
    .regex(/^(\+?880|0)1[3-9]\d{8}$/, "Invalid phone number"),
  amount: z.number().positive("Amount must be positive"),
});
