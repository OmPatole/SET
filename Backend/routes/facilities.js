import express from 'express';
import Facility from '../models/Facility.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const facilities = await Facility.find({ active: true }).sort({ order: 1 });
    res.json(facilities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/all', protect, async (req, res) => {
  try {
    const facilities = await Facility.find().sort({ order: 1 });
    res.json(facilities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const count = await Facility.countDocuments();
    const facility = await Facility.create({ ...req.body, order: req.body.order ?? count });
    res.status(201).json(facility);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const facility = await Facility.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!facility) return res.status(404).json({ message: 'Facility not found' });
    res.json(facility);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    await Facility.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
