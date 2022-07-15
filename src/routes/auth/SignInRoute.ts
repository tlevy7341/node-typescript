import express from "express";
import { signIn } from "../../controllers/auth/SignInController";
import { validateInput } from "../../middleware/validateInput.middleware";
import { signInSchema } from "../../models/AuthSchema";

const signInRoute = express.Router();

signInRoute.post("/signin", validateInput(signInSchema), signIn);

export default signInRoute;
