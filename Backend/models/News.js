import mongoose from 'mongoose';

const newsSchema = new mongoose.Schema(
  {
    tag: { type: String, default: 'News' },
    date: { type: String, default: '' },
    author: { type: String, default: '' },
    read: { type: String, default: '1 min' },
    title: { type: String, required: true },
    excerpt: { type: String, default: '' },
    image: { type: String, default: '' },
    href: { type: String, default: '#' },
    active: { type: Boolean, default: true },
    pinned: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('News', newsSchema);
