import express from 'express';
import HeroSlide from '../models/HeroSlide.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public: GET active slides
router.get('/', async (req, res) => {
  try {
    const slides = await HeroSlide.find({ active: true }).sort({ order: 1 });
    res.json(slides);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: GET all slides
router.get('/all', protect, async (req, res) => {
  try {
    const slides = await HeroSlide.find().sort({ order: 1 });
    res.json(slides);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: POST create slide
router.post('/', protect, async (req, res) => {
  try {
    const count = await HeroSlide.countDocuments();
    const slide = await HeroSlide.create({ ...req.body, order: req.body.order ?? count });
    res.status(201).json(slide);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Admin: PUT update slide
router.put('/:id', protect, async (req, res) => {
  try {
    const slide = await HeroSlide.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!slide) return res.status(404).json({ message: 'Slide not found' });
    res.json(slide);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Admin: DELETE slide
router.delete('/:id', protect, async (req, res) => {
  try {
    await HeroSlide.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
