import express from "express";
import { deleteAccount } from "../../controllers/auth/DeleteAccountController";
import { validateInput } from "../../middleware/validateInput.middleware";
import { validateToken } from "../../middleware/validateToken.middleware";
import { deleteAccountSchema } from "../../models/AuthSchema";

const deleteAccountRoute = express.Router();

deleteAccountRoute.delete(
  "/delete-account",
  validateToken,
  validateInput(deleteAccountSchema),
  deleteAccount
);

export default deleteAccountRoute;
