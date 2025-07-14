const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Get User Profile
exports.getProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
};

// Get User Profile
exports.getAllUser = async (req, res) => {
  const user = await User.find().select("-password");
  res.json(user);
};

// Update User
exports.updateUser = async (req, res) => {
  const { name, email } = req.body;
  const user = await User.findById(req.user.id);

  if (!user) return res.status(404).json({ message: "User not found" });

  user.name = name || user.name;
  user.email = email || user.email;

  await user.save();
  res.json({ message: "Profile Updated", user });
};

// Delete User (Admin Only)
exports.deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User Deleted" });
};
