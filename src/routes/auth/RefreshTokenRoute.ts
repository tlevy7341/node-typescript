import express from "express";
import { refreshToken } from "../../controllers/auth/RefreshTokenController";

const refreshTokenRoute = express.Router();

refreshTokenRoute.get("/refresh-token", refreshToken);

export default refreshTokenRoute;
