import express from "express";
import userAuth from "../middleware/userAuth.js";
import { forgotPasswordLimiter, loginRateLimiter, otpLimiter, signupRateLimiter, verifyOTPRateLimiter } from "../middleware/rateLimit.js";
import * as AuthController from '../controllers/authController.js';

const authRouter = express.Router();

authRouter.post("/signup", signupRateLimiter, AuthController.signup);
authRouter.post("/login", loginRateLimiter, AuthController.login);
authRouter.post("/logout", userAuth, AuthController.logout);
authRouter.post("/verify-email", verifyOTPRateLimiter, AuthController.verifyEmail);
authRouter.post("/forgot-password", forgotPasswordLimiter, AuthController.forgotPassword);
authRouter.post("/reset-password/:token", AuthController.resetPassword);
authRouter.get("/is-auth", userAuth, AuthController.isAuthenticated);
authRouter.post("/resend-otp", userAuth, otpLimiter, AuthController.resendVerifyOTP);


export default authRouter;
