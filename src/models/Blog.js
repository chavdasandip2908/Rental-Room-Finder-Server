const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        content: { type: String, required: true },
        photo: { type: String, default: "" },
        author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        feedbacks: [
            {
                user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
                message: { type: String, required: true },
                createdAt: { type: Date, default: Date.now },
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);
