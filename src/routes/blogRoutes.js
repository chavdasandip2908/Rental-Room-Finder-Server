const express = require("express");
const {
    createBlog,
    getAllBlogs,
    getBlogById,
    updateBlog,
    deleteBlog,
    addFeedback,
} = require("../controllers/blogController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// Blog Routes
router.post("/create", protect, createBlog);
router.get("/", getAllBlogs);
router.get("/:id", getBlogById);
router.put("/update/:id", protect, updateBlog);
router.delete("/delete/:id", protect, deleteBlog);
router.post("/:id/feedback", protect, addFeedback);

module.exports = router;
