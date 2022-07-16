import express from "express";
import { validateInput } from "../../middleware/validateInput.middleware";
import { updateAvatarSchema } from "../../models/AuthSchema";
import { updateAvatar } from "./../../controllers/auth/UpdateAvatarController";

const updateAvatarRoute = express.Router();

updateAvatarRoute.patch(
  "/update-avatar",
  validateInput(updateAvatarSchema),
  updateAvatar
);

export default updateAvatarRoute;
