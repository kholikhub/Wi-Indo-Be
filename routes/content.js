// routes/content.js
const express = require('express');
const multer = require('multer');
const Content = require('../models/Content');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

const upload = multer({ dest: 'uploads/' });

// Upload Content
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  const { title, description } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;
  try {
    const content = new Content({ title, description, image, userId: req.user.id });
    await content.save();
    res.status(201).json({ message: 'Content uploaded successfully' });
  } catch (err) {
    res.status(400).json({ message: 'Error uploading content', error: err.message });
  }
});

// List Content
router.get('/', authMiddleware, async (req, res) => {
  const contents = await Content.find({ userId: req.user.id });
  res.json(contents);
});

module.exports = router;