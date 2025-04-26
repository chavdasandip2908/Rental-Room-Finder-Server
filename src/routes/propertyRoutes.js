const express = require("express");
const {
    createProperty,
    getProperties,
    getPropertyById,
    updateProperty,
    deleteProperty,
    getGalleryProperties,
    getPendingGalleryProperties,
    requestGalleryApproval,
    approveGallery,
    markPropertySold,
    getUserBuyAllProperty,
    requestProperty,
    getPropertyRequests,
    getOwnerPropertyRequests,
    getSpecificUserProperty,
    approvePropertyRequest,
    rejectPropertyRequest,
    searchProperties,
} = require("../controllers/propertyController");
const { protect, isAdmin, isSeller } = require("../middlewares/authMiddleware");

const router = express.Router();

// normal CRUD
router.post("/create", protect, createProperty);
router.get("/", getProperties);
router.put("/update/:id", protect, updateProperty);
router.delete("/delete/:id", protect, deleteProperty);
router.get("/:id", getPropertyById);
// gallery 
router.get("/gallery", getGalleryProperties);
router.get("/gallery/requests", protect, isAdmin, getPendingGalleryProperties);
router.patch("/gallery/request/:id", protect, isSeller, requestGalleryApproval);
router.put("/gallery/approve/:id", protect, isAdmin, approveGallery);
// buy or sell
router.get("/buyer/properties", protect, getUserBuyAllProperty);
router.put("/sold/:id", protect, markPropertySold);
router.post("/request/:pid", protect, requestProperty);
router.get("/requests/owner", protect, getOwnerPropertyRequests);
router.get("/requests/:pid", protect, getPropertyRequests);
router.get("/user/properties", protect, getSpecificUserProperty);
router.put("/approve-request/:requestId", protect, approvePropertyRequest);
router.put("/reject-request/:requestId", protect, rejectPropertyRequest);
// searching
router.get("/search/properties", searchProperties);


module.exports = router;
