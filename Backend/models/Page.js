import mongoose from 'mongoose';

const pageSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    title: { type: String, required: true, trim: true },
    section: { type: String, required: true, trim: true, lowercase: true }, // groups pages in sidebar e.g. 'about', 'academics'
    sectionLabel: { type: String, trim: true }, // display name e.g. 'About SET'
    content: { type: String, default: '' }, // HTML content
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Page', pageSchema);
