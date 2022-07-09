import express from "express";
import {
  deleteAccount,
  forgotPassword,
  resetPassword,
  signIn,
  signOut,
  signUp,
} from "../controllers/auth.controller";
import { validateInput } from "../middleware/validateInput.middleware";
import { validateToken } from "../middleware/validateToken.middleware";
import {
  deleteAccountSchema,
  forgotPasswordSchema,
  passwordResetSchema,
  signInSchema,
  signUpSchema,
} from "../models/auth.schema";

const authRoutes = express.Router();

authRoutes.post("/signup", validateInput(signUpSchema), signUp);
authRoutes.post("/signin", validateInput(signInSchema), signIn);
authRoutes.get("/signout", signOut);
authRoutes.post(
  "/forgot-password",
  validateInput(forgotPasswordSchema),
  forgotPassword
);
authRoutes.post(
  "/reset-password",
  validateInput(passwordResetSchema),
  resetPassword
);
authRoutes.delete(
  "/delete-account",
  validateToken,
  validateInput(deleteAccountSchema),
  deleteAccount
);

export default authRoutes;
