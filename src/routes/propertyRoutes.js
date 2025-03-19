const express = require("express");
const {
    createProperty,
    getProperties,
    getPropertyById,
    updateProperty,
    deleteProperty,
    getGalleryProperties,
    approveGallery,
    markPropertySold,
} = require("../controllers/propertyController");
const { protect, isAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/create", protect, createProperty);
router.get("/", getProperties);
router.get("/:id", getPropertyById);
router.put("/update/:id", protect, updateProperty); 
router.delete("/delete/:id", protect, deleteProperty);
router.get("/gallery", getGalleryProperties);
router.put("/gallery/approve/:id", protect, isAdmin, approveGallery);
router.put("/sold/:id", protect, markPropertySold); 

module.exports = router;
