import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2).max(60)
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const orderSchema = z.object({
  serviceId: z.string().min(1),
  link: z.string().url(),
  quantity: z.coerce.number().int().positive().max(100000)
});

export const ticketSchema = z.object({
  subject: z.string().min(4).max(120),
  message: z.string().min(10).max(2000)
});

export const ticketReplySchema = z.object({
  message: z.string().min(1).max(2000)
});
