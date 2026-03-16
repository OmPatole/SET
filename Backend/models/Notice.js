import mongoose from 'mongoose';

const noticeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, default: '' },
    category: {
      type: String,
      enum: ['General', 'Exam', 'Academic', 'Event', 'Scholarship', 'Placement', 'Holiday'],
      default: 'General',
    },
    program: {
      type: String,
      enum: ['All', 'B.Tech', 'M.Tech', 'PhD'],
      default: 'All',
    },
    attachmentUrl: { type: String, default: '' },
    isImportant: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
    publishedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model('Notice', noticeSchema);
