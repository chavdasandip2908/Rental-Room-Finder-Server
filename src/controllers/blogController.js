const Blog = require("../models/Blog");

// Create a New Blog
exports.createBlog = async (req, res) => {
  try {
    const { title, content, photo } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    const blog = new Blog({
      title,
      content,
      photo: photo || "", 
      author: req.user.id,
    });

    await blog.save();
    res.status(201).json({ message: "Blog created successfully", blog });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Blogs
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate("author", "name email")
      .populate("feedbacks.user", "name email")
      .select("title content photo author feedbacks createdAt") // Select only necessary fields
      .sort({ createdAt: -1 }) // Sort by newest first
      .lean(); // Optimize performance by returning plain objects

    if (!blogs.length) {
      return res.status(404).json({ message: "No blogs found" });
    }

    res.status(200).json(blogs);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ message: "Internal server error. Please try again later." });
  }
};


// Get One Blog Full Info
exports.getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id)
      .populate("author", "name email")
      .populate("feedbacks.user", "name email");

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Blog (Only Owner)
exports.updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, image } = req.body;

    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    if (blog.author.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "You can only update your own blog" });
    }

    blog.title = title || blog.title;
    blog.content = content || blog.content;
    blog.image = image || blog.image;
    await blog.save();

    res.status(200).json({ message: "Blog updated successfully", blog });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Blog (Only Owner)
exports.deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    if (blog.author.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "You can only delete your own blog" });
    }

    await blog.deleteOne();
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add Feedback to Blog
exports.addFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    blog.feedbacks.push({ user: req.user.id, message });
    await blog.save();

    res.status(201).json({ message: "Feedback added successfully", blog });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
