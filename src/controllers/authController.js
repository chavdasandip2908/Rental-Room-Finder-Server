const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
<<<<<<< HEAD
const crypto = require("crypto");
=======
>>>>>>> 294043b (add payment gatway)
const sendEmail = require("../config/email");

// Register User
exports.register = async (req, res) => {
<<<<<<< HEAD
  const { name, email, password, role } = req.body;

  let user = await User.findOne({ email });
  if (user) return res.status(400).json({ message: "Email already exists" });

  user = new User({ name, email, password, role });
  await user.save();

  res.status(201).json({ message: "User registered successfully" });
=======
  const { name, email, password } = req.body;

  let user = await User.findOne({ email });
  if (user) 
    return res.status(400).json({ message: "Email already exists" });

  user = new User({ name, email, password });
  await user.save();

  res.status(201).json({ user });
>>>>>>> 294043b (add payment gatway)
};

// Login User
exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
<<<<<<< HEAD
  if (!user) return res.status(400).json({ message: "User not Register" });
=======
  if (!user) return res.status(400).json({ message: "Invalid credentials" });
>>>>>>> 294043b (add payment gatway)

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

<<<<<<< HEAD
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
=======
  const token = jwt.sign({ id: user._id, role: user.role }, "rentrooms", { expiresIn: "7d" });
  console.log(token);
>>>>>>> 294043b (add payment gatway)
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


<<<<<<< HEAD
// Forgot Password - Send Reset Code
=======
// Forgot Password - Send Reset Link
>>>>>>> 294043b (add payment gatway)
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

<<<<<<< HEAD
  // Generate a 6-digit random OTP
  const resetCode = crypto.randomInt(100000, 999999).toString();

  // Store OTP and expiration in user document
  user.resetCode = resetCode;
  user.resetCodeExpires = Date.now() + 15 * 60 * 1000; // 15 minutes expiry
  await user.save();

  await sendEmail(user.email, "Password Reset Request ", resetCode);
=======
  const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });

  const resetLink = `${process.env.CLIENT_URL}/reset-password.html?token=${resetToken}`;
  console.log(process.env.CLIENT_URL)
  await sendEmail(user.email, user.name, "Password Reset Request ", resetLink);
>>>>>>> 294043b (add payment gatway)

  res.json({ message: "Reset link sent to email" });
};

// Reset Password - Set New Password
exports.resetPassword = async (req, res) => {
  try {
<<<<<<< HEAD
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
=======
    const { token } = req.params;
    const { newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
>>>>>>> 294043b (add payment gatway)
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password reset successfully!" });
<<<<<<< HEAD
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


=======
} catch (error) {
    res.status(400).json({ message: "Invalid or expired token" });
}
};

>>>>>>> 294043b (add payment gatway)
