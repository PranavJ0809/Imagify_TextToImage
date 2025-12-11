import sendOtpEmail from "../utils/sendOtpEmail.js";
import otpModel from "../models/otpModel.js";

const sendOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.json({ success: false, message: "Email required" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

  await otpModel.findOneAndUpdate(
    { email },
    { otp, expiresAt },
    { upsert: true, new: true }
  );

  try {
    await sendOtpEmail(email, otp);
    res.json({ success: true, message: "OTP sent" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  const record = await otpModel.findOne({ email });

  if (!record || record.otp !== otp || new Date() > record.expiresAt) {
    return res.json({ success: false, message: "Invalid or expired OTP" });
  }

  await otpModel.deleteOne({ email }); // single-use
  res.json({ success: true, message: "OTP verified" });
};

export { sendOtp, verifyOtp };