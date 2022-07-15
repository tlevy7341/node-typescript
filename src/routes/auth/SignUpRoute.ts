import express from "express";
import { signUp } from "../../controllers/auth/SignUpController";
import { validateInput } from "../../middleware/validateInput.middleware";
import { signUpSchema } from "../../models/AuthSchema";

const signUpRoute = express.Router();

signUpRoute.post("/signup", validateInput(signUpSchema), signUp);

export default signUpRoute;
