import express from 'express';
import Page from '../models/Page.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public: get all active pages in a section (for sidebar)
router.get('/section/:section', async (req, res) => {
  try {
    const pages = await Page.find({ section: req.params.section, active: true })
      .select('slug title order')
      .sort({ order: 1 });
    res.json(pages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Public: get single page by slug
router.get('/:slug', async (req, res) => {
  try {
    const page = await Page.findOne({ slug: req.params.slug, active: true });
    if (!page) return res.status(404).json({ message: 'Page not found' });
    res.json(page);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: get all pages
router.get('/', protect, async (req, res) => {
  try {
    const pages = await Page.find().sort({ section: 1, order: 1 });
    res.json(pages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: create page
router.post('/', protect, async (req, res) => {
  try {
    const page = await Page.create(req.body);
    res.status(201).json(page);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Admin: update page
router.put('/:id', protect, async (req, res) => {
  try {
    const page = await Page.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!page) return res.status(404).json({ message: 'Page not found' });
    res.json(page);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Admin: delete page
router.delete('/:id', protect, async (req, res) => {
  try {
    await Page.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
