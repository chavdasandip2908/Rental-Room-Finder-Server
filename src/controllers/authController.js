const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const sendEmail = require("../config/email");

// Register User
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  let user = await User.findOne({ email });
  if (user) return res.status(400).json({ message: "Email already exists" });

  user = new User({ name, email, password });
  await user.save();

  res.status(201).json({ message: "User registered successfully" });
};

// Login User
exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

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


// Forgot Password - Send Reset Link
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });

  const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
  await sendEmail(user.email, user.name, "Password Reset Request ", resetLink);

  res.json({ message: "Reset link sent to email" });
};

// Reset Password - Set New Password
exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) return res.status(404).json({ message: "Invalid or expired token" });

    user.password = newPassword;
    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(400).json({ message: "Invalid or expired token" });
  }
};

