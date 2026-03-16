import express from 'express';
import News from '../models/News.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public: active news (most recent first)
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;
    const news = await News.find({ active: true })
      .sort({ pinned: -1, createdAt: -1 })
      .limit(limit);
    res.json(news);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: all news
router.get('/all', protect, async (req, res) => {
  try {
    const news = await News.find().sort({ createdAt: -1 });
    res.json(news);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const item = await News.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const item = await News.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ message: 'News not found' });
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    await News.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
