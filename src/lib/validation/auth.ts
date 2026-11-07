import { z } from "zod";
import { REGISTERABLE_ROLES } from "@/lib/auth/roles";

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required.")
    .max(100, "Name must be at most 100 characters."),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please enter a valid email address.")
    .max(254, "Email is too long."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(72, "Password must be at most 72 characters."),
  role: z.enum(REGISTERABLE_ROLES, {
    error: "Please choose either Candidate or Employer.",
  }),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Invalid email or password."),
  password: z.string().min(1, "Invalid email or password.").max(72, "Invalid email or password."),
});

export type LoginInput = z.infer<typeof loginSchema>;

