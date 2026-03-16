import express from 'express';
import Alumni from '../models/Alumni.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const alumni = await Alumni.find({ active: true }).sort({ order: 1 });
    res.json(alumni);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/all', protect, async (req, res) => {
  try {
    const alumni = await Alumni.find().sort({ order: 1 });
    res.json(alumni);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const count = await Alumni.countDocuments();
    const person = await Alumni.create({ ...req.body, order: req.body.order ?? count });
    res.status(201).json(person);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const person = await Alumni.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!person) return res.status(404).json({ message: 'Alumni not found' });
    res.json(person);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    await Alumni.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
