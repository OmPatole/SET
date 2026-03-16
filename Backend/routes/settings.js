import express from 'express';
import SiteSetting from '../models/SiteSetting.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public: GET all settings as a flat object
router.get('/', async (req, res) => {
  try {
    const settings = await SiteSetting.find();
    const result = {};
    settings.forEach((s) => {
      result[s.key] = s.value;
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: PUT update a single setting
router.put('/:key', protect, async (req, res) => {
  try {
    const { value, group, label } = req.body;
    const setting = await SiteSetting.findOneAndUpdate(
      { key: req.params.key },
      { value, group, label },
      { new: true, upsert: true }
    );
    res.json(setting);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Admin: PUT bulk update settings
router.put('/', protect, async (req, res) => {
  try {
    const { settings } = req.body; // { key: value, ... }
    await Promise.all(
      Object.entries(settings).map(([key, value]) =>
        SiteSetting.findOneAndUpdate({ key }, { value }, { upsert: true })
      )
    );
    res.json({ message: 'Settings updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
