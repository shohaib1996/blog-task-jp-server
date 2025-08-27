const express = require("express");
const Post = require("../models/Post");

const router = express.Router();

// GET all posts with pagination
router.get("/", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const posts = await Post.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
    const totalPosts = await Post.countDocuments();
    const totalPages = Math.ceil(totalPosts / limit);

    res.json({
      posts,
      meta: {
        page,
        limit,
        totalPages,
        totalPosts,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single post by id
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE new post
router.post("/", async (req, res) => {
  const { title, content, author, thumbnail, type } = req.body;
  try {
    const newPost = new Post({ title, content, author, thumbnail, type });
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
