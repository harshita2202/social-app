const express = require('express');
const multer = require('multer');
const path = require('path');
const Post = require('../../../backend/models/Post');
const authMiddleware = require('../../../backend/middleware/auth');

const router = express.Router();

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// Get all posts (public feed)
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create post
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { text } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : '';

    if (!text && !image)
      return res.status(400).json({ message: 'Post must have text or image' });

    const post = new Post({
      author: req.user.id,
      username: req.user.username,
      text: text || '',
      image,
      likes: [],
      comments: []
    });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Like / Unlike post
router.post('/:id/like', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const username = req.user.username;
    const alreadyLiked = post.likes.includes(username);

    if (alreadyLiked) {
      post.likes = post.likes.filter(u => u !== username);
    } else {
      post.likes.push(username);
    }
    await post.save();
    res.json({ likes: post.likes });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add comment
router.post('/:id/comment', authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: 'Comment text required' });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const comment = {
      username: req.user.username,
      userId: req.user.id,
      text,
      createdAt: new Date()
    };
    post.comments.push(comment);
    await post.save();
    res.json({ comments: post.comments });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
