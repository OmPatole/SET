import express from 'express';
import Notice from '../models/Notice.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public: active notices (students can see these)
router.get('/', async (req, res) => {
  try {
    const { category, program, limit = 20 } = req.query;
    const filter = { active: true };
    if (category && category !== 'All') filter.category = category;
    if (program && program !== 'All') filter.program = { $in: [program, 'All'] };

    const notices = await Notice.find(filter)
      .sort({ isImportant: -1, publishedAt: -1 })
      .limit(parseInt(limit));
    res.json(notices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: all notices
router.get('/all', protect, async (req, res) => {
  try {
    const notices = await Notice.find().sort({ publishedAt: -1 });
    res.json(notices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: create notice
router.post('/', protect, async (req, res) => {
  try {
    const notice = await Notice.create(req.body);
    res.status(201).json(notice);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Admin: update notice
router.put('/:id', protect, async (req, res) => {
  try {
    const notice = await Notice.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!notice) return res.status(404).json({ message: 'Notice not found' });
    res.json(notice);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Admin: delete notice
router.delete('/:id', protect, async (req, res) => {
  try {
    await Notice.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
