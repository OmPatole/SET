import express from 'express';
import Department from '../models/Department.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public: active departments
router.get('/', async (req, res) => {
  try {
    const deps = await Department.find({ active: true }).sort({ order: 1 });
    res.json(deps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: all departments
router.get('/all', protect, async (req, res) => {
  try {
    const deps = await Department.find().sort({ order: 1 });
    res.json(deps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const count = await Department.countDocuments();
    const dep = await Department.create({ ...req.body, order: req.body.order ?? count });
    res.status(201).json(dep);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const dep = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!dep) return res.status(404).json({ message: 'Department not found' });
    res.json(dep);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    await Department.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
