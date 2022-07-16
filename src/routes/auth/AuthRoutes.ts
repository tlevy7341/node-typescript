import express from "express";
import deleteAccountRoute from "./DeleteAccountRoute";
import forgotPasswordRoute from "./ForgotPasswordRoute";
import refreshTokenRoute from "./RefreshTokenRoute";
import resetPasswordRoute from "./ResetPasswordRoute";
import signInRoute from "./SignInRoute";
import signOutRoute from "./SignOutRoute";
import signUpRoute from "./SignUpRoute";
import updateAvatarRoute from "./UpdateAvatarRoute";

const authRoutes = express.Router();

authRoutes.use(deleteAccountRoute);
authRoutes.use(signInRoute);
authRoutes.use(signUpRoute);
authRoutes.use(signOutRoute);
authRoutes.use(refreshTokenRoute);
authRoutes.use(forgotPasswordRoute);
authRoutes.use(resetPasswordRoute);
authRoutes.use(updateAvatarRoute);

export default authRoutes;
