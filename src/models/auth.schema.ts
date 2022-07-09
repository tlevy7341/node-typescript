import { number, object, string } from "zod";

export const signUpSchema = object({
  email: string({ required_error: "Please provide an email" }).email().trim(),
  password: string({ required_error: "Please provide a password" })
    .min(8, { message: "Password must be at least 8 characters" })
    .trim(),
});

export const signInSchema = object({
  email: string({ required_error: "Please provide an email" }).email().trim(),
  password: string({ required_error: "Please provide a password" }).trim(),
});

export const deleteAccountSchema = object({
  id: number({ required_error: "Please provide an id" }),
});

export const forgotPasswordSchema = object({
  email: string({ required_error: "Please provide an email" }).email().trim(),
});

export const passwordResetSchema = object({
  token: string({ required_error: "Please provide a token" }).trim(),
  password: string({ required_error: "Please provide a password" }).trim(),
  passwordConfirm: string({
    required_error: "Please confirm your password",
  }).trim(),
}).refine((data) => data.password === data.passwordConfirm, {
  message: "Passwords do not match",
  path: ["passwordConfirm"],
});
