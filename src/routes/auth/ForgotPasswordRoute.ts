import express from "express";
import { forgotPassword } from "../../controllers/auth/ForgotPasswordController";
import { validateInput } from "../../middleware/validateInput.middleware";
import { forgotPasswordSchema } from "../../models/AuthSchema";

const forgotPasswordRoute = express.Router();

forgotPasswordRoute.post(
  "/forgot-password",
  validateInput(forgotPasswordSchema),
  forgotPassword
);

export default forgotPasswordRoute;
