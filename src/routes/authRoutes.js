const express = require("express");
const { register, login, changePassword, forgotPassword, resetPassword, validateToken } = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.put("/change-password", protect, changePassword);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/verify", validateToken);
router.post("/reset-password/:token",protect, resetPassword);

module.exports = router;
