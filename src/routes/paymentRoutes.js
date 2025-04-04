const express = require("express");
const { property, verify } = require("../controllers/paymentController");
const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/property", protect, property);
router.post("/verify", protect, verify);


module.exports = router;
