import mongoose from 'mongoose';

const alumniSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    company: { type: String, default: '' },
    role: { type: String, default: '' },
    batch: { type: String, default: '' },
    image: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Alumni', alumniSchema);
