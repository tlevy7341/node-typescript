import express from "express";
import { resetPassword } from "../../controllers/auth/ResetPasswordController";
import { validateInput } from "../../middleware/validateInput.middleware";
import { resetPasswordSchema } from "../../models/AuthSchema";

const resetPasswordRoute = express.Router();

resetPasswordRoute.patch(
  "/reset-password",
  validateInput(resetPasswordSchema),
  resetPassword
);

export default resetPasswordRoute;
