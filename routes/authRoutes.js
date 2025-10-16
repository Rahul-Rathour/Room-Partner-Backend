const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator');
const User = require('../models/User');
require('dotenv').config();

// 💌 Setup nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER, // example: yourapp@gmail.com
    pass: process.env.MAIL_PASS  // App password (NOT your Gmail password)
  }
});

// ✅ Request OTP
router.post('/request-otp', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'Email not found.' });

  const otp = otpGenerator.generate(6, {
    digits: true,
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false
  });
  user.otp = otp;
  user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 min
  await user.save();

  await transporter.sendMail({
    from: process.env.MAIL_USER,
    to: email,
    subject: 'OTP for Room-Partner Password Reset',
    text: `Your OTP is: ${otp}. It expires in 10 minutes.`
  });

  res.json({ message: 'OTP sent to your email.' });
});

// 🔒 Reset Password
router.post('/reset-password', async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const user = await User.findOne({ email });

  if (!user || user.otp !== otp || Date.now() > user.otpExpires) {
    return res.status(400).json({ message: 'Invalid or expired OTP' });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  user.otp = null;
  user.otpExpires = null;
  await user.save();

  res.json({ message: 'Password has been reset successfully!' });
});

module.exports = router;
