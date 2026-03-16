import mongoose from 'mongoose';

const statSchema = new mongoose.Schema(
  {
    icon: { type: String, default: 'FiUsers' },
    value: { type: Number, required: true },
    suffix: { type: String, default: '' },
    label: { type: String, required: true },
    sublabel: { type: String, default: '' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('Stat', statSchema);
