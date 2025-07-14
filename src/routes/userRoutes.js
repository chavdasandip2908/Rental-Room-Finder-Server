const express = require("express");
const { getProfile, updateUser, deleteUser, getAllUser } = require("../controllers/userController");
const { protect, isAdmin, isSelfOrAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();
router.get("/", protect, getAllUser);
router.get("/profile", protect, isSelfOrAdmin, getProfile);
router.put("/update", protect, isSelfOrAdmin, updateUser);
router.delete("/delete/:id", protect, isAdmin, deleteUser);

module.exports = router;
