const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const sendEmail = require("../config/email");

// Register User
exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  let user = await User.findOne({ email });
  if (user) return res.status(400).json({ message: "Email already exists" });

  user = new User({ name, email, password, role });
  await user.save();

  res.status(201).json({ message: "User registered successfully" });
};

// Login User
exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "User not Register" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.json({ token });
};

// Change Password
exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) return res.status(400).json({ message: "Incorrect old password" });

  user.password = newPassword;
  await user.save();

  res.json({ message: "Password changed successfully" });
};


// Forgot Password - Send Reset Code
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  // Generate a 6-digit random OTP
  const resetCode = crypto.randomInt(100000, 999999).toString();

  // Store OTP and expiration in user document
  user.resetCode = resetCode;
  user.resetCodeExpires = Date.now() + 15 * 60 * 1000; // 15 minutes expiry
  await user.save();

  await sendEmail(user.email, "Password Reset Request ", resetCode);

  res.json({ message: "Reset link sent to email" });
};

// Reset Password - Set New Password
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not Found" });
    }

    if (user.resetCode !== otp || Date.now() > user.resetCodeExpires) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.resetCode = null; // Remove OTP after use
    user.resetCodeExpires = null;
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password reset successfully!" });
  } catch (error) {
    res.status(400).json({ message: "Invalid or expired token" });
  }
};

// token validation 
exports.validateToken = async (req, res) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    res.status(200).json({ valid: true, message: "Token is valid", userId: decoded.id });

  } catch (error) {
    res.status(401).json({ valid: false, message: "Invalid or expired token" });
  }
};


