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
    requestProperty,
    getPropertyRequests,
    approvePropertyRequest,
    rejectPropertyRequest,
    searchProperties,
} = require("../controllers/propertyController");
const { protect, isAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/create", protect, createProperty);
router.get("/", getProperties);
router.put("/update/:id", protect, updateProperty);
router.delete("/delete/:id", protect, deleteProperty);
router.get("/gallery", getGalleryProperties);
router.get("/:id", getPropertyById);
router.put("/gallery/approve/:id", protect, isAdmin, approveGallery);
router.put("/sold/:id", protect, markPropertySold);
router.post("/request/:pid", protect, requestProperty);
router.get("/requests/:pid", protect, getPropertyRequests);
router.put("/approve-request/:requestId", protect, approvePropertyRequest);
router.put("/reject-request/:requestId", protect, rejectPropertyRequest);
router.get("/search/properties", searchProperties);


module.exports = router;
