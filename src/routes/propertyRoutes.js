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
    rejectGalleryRequest,
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

// gallery related routes (admin/seller related)
router.get("/gallery", getGalleryProperties);
router.get("/gallery/requests", protect, isAdmin, getPendingGalleryProperties);
router.patch("/gallery/request/:id", protect, isSeller, requestGalleryApproval);
router.put("/gallery/approve/:id", protect, isAdmin, approveGallery);
router.put("/gallery/reject/:id", protect, isAdmin, rejectGalleryRequest);

// normal CRUD operations
router.post("/create", protect, createProperty);
router.get("/search/properties", searchProperties); // specific search route should come before general routes
router.get("/", getProperties); // get all properties
router.get("/:id", getPropertyById); // get one property (should be after more specific GET routes)
router.put("/update/:id", protect, updateProperty);
router.delete("/delete/:id", protect, deleteProperty);

// buy or sell operations
router.get("/buyer/properties", protect, getUserBuyAllProperty);
router.get("/user/properties", protect, getSpecificUserProperty);
router.put("/sold/:id", protect, markPropertySold);
router.post("/request/:pid", protect, requestProperty);
router.get("/requests/owner", protect, getOwnerPropertyRequests);
router.get("/requests/:pid", protect, getPropertyRequests);
router.put("/approve-request/:requestId", protect, approvePropertyRequest);
router.put("/reject-request/:requestId", protect, rejectPropertyRequest);



module.exports = router;
