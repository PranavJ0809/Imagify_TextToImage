import express from 'express';
import { registerUser, loginUser, userCredits, paymentRazorpay, verifyRazorpay} from '../controllers/userController.js';
import userAuth from '../middlewares/auth.js';

import { sendOtp, verifyOtp } from "../controllers/otpController.js";
import otpRateLimiter from "../middlewares/rateLimiter.js";

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/credits', userAuth, userCredits);

userRouter.post('/pay-razor',userAuth ,paymentRazorpay);
userRouter.post('/verify-razor', verifyRazorpay);

userRouter.post("/send-otp", otpRateLimiter, sendOtp);
userRouter.post("/verify-otp", verifyOtp);

export default userRouter;