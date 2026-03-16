import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { protect } from '../middleware/auth.js';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// Allowed MIME types
const ALLOWED_TYPES = {
  'application/pdf': '.pdf',
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
};

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = ALLOWED_TYPES[file.mimetype] || path.extname(file.originalname);
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_').replace(/\s+/g, '_');
    cb(null, `${Date.now()}_${safeName}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15 MB
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_TYPES[file.mimetype]) return cb(null, true);
    cb(new Error(`File type not allowed. Allowed: PDF, JPG, PNG, WEBP`));
  },
});

// POST /api/upload — upload a single file (admin only)
router.post('/', protect, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

  const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
  const fileUrl = `${baseUrl}/uploads/${req.file.filename}`;

  res.status(201).json({
    url: fileUrl,
    filename: req.file.filename,
    originalName: req.file.originalname,
    size: req.file.size,
    mimetype: req.file.mimetype,
  });
});

// DELETE /api/upload/:filename — delete an uploaded file (admin only)
router.delete('/:filename', protect, (req, res) => {
  const filename = path.basename(req.params.filename); // prevent path traversal
  const filePath = path.join(uploadsDir, filename);

  if (!fs.existsSync(filePath)) return res.status(404).json({ message: 'File not found' });

  fs.unlinkSync(filePath);
  res.json({ message: 'File deleted' });
});

// GET /api/upload/list — list uploaded files (admin only)
router.get('/list', protect, (req, res) => {
  const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
  const files = fs.readdirSync(uploadsDir).map((name) => {
    const stats = fs.statSync(path.join(uploadsDir, name));
    return {
      filename: name,
      url: `${baseUrl}/uploads/${name}`,
      size: stats.size,
      createdAt: stats.birthtime,
    };
  }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(files);
});

export default router;
