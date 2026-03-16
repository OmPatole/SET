import express from 'express';
import Application from '../models/Application.js';

import { protect } from '../middleware/auth.js'; 

const router = express.Router();

// GET all applications (Admin)
router.get('/', protect, async (req, res) => {
  try {
    const applications = await Application.find().sort('-submittedAt');
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST a new application (Public)
router.post('/', async (req, res) => {
  try {
    const application = new Application(req.body);
    const saved = await application.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: 'Validation error', error: err.message });
  }
});

// PUT update status (Admin)
router.put('/:id', protect, async (req, res) => {
  try {
    const updated = await Application.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    await Application.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
