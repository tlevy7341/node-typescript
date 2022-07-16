import { number, object, string } from "zod";

export const signUpSchema = object({
  email: string().email().trim(),
  password: string({ required_error: "Please provide a password" })
    .min(8, { message: "Password must be at least 8 characters" })
    .trim(),
});

export const signInSchema = object({
  email: string().email().trim(),
  password: string().min(1, "Please provide a password").trim(),
});

export const deleteAccountSchema = object({
  id: number({ required_error: "Please provide an id" }),
});

export const forgotPasswordSchema = object({
  email: string().email().trim(),
});

export const resetPasswordSchema = object({
  authToken: string({ required_error: "Please provide a token" }).trim(),
  password: string({ required_error: "Please provide a password" }).trim(),
});

export const updateAvatarSchema = object({
  avatar: string().min(1, "Please provide an avatar").trim(),
  id: number({ required_error: "Please provide an id" }),
});
