const express = require("express");
const { getProfile, updateUser, deleteUser } = require("../controllers/userController");
const { protect, isAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/profile", protect, getProfile);
router.put("/update", protect, updateUser);
router.delete("/delete/:id", protect, isAdmin, deleteUser);

module.exports = router;
