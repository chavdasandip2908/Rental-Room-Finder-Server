const express = require("express");
const {property,verify  } = require("../controllers/paymentController");
const router = express.Router();

router.post("/Property", property);
router.post("/verify", verify);


module.exports = router;
