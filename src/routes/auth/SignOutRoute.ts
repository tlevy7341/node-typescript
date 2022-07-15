import express from "express";
import { signOut } from "../../controllers/auth/SignOutController";

const signOutRoute = express.Router();

signOutRoute.get("/signout", signOut);

export default signOutRoute;
