import express from 'express';
import NavItem from '../models/NavItem.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public: GET active nav items (ordered)
router.get('/', async (req, res) => {
  try {
    const items = await NavItem.find({ active: true }).sort({ order: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: GET all nav items
router.get('/all', protect, async (req, res) => {
  try {
    const items = await NavItem.find().sort({ order: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: POST create nav item
router.post('/', protect, async (req, res) => {
  try {
    const count = await NavItem.countDocuments();
    const item = await NavItem.create({ ...req.body, order: req.body.order ?? count });
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Admin: PUT update nav item
router.put('/:id', protect, async (req, res) => {
  try {
    const item = await NavItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) return res.status(404).json({ message: 'Nav item not found' });
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Admin: DELETE nav item
router.delete('/:id', protect, async (req, res) => {
  try {
    const item = await NavItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Nav item not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: PUT reorder (bulk update orders)
router.put('/reorder/bulk', protect, async (req, res) => {
  try {
    const { items } = req.body; // [{ id, order }]
    await Promise.all(
      items.map(({ id, order }) => NavItem.findByIdAndUpdate(id, { order }))
    );
    res.json({ message: 'Reordered successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
