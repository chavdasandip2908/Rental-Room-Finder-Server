const express = require("express");
<<<<<<< HEAD
const { register, login, changePassword, forgotPassword, resetPassword, validateToken } = require("../controllers/authController");
=======
const { register, login, changePassword, forgotPassword, resetPassword } = require("../controllers/authController");
>>>>>>> 294043b (add payment gatway)
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.put("/change-password", protect, changePassword);
router.post("/forgot-password", forgotPassword);
<<<<<<< HEAD
router.post("/reset-password", resetPassword);
router.get("/verify", validateToken);

=======
router.post("/reset-password/:token",protect, resetPassword);
>>>>>>> 294043b (add payment gatway)

module.exports = router;
