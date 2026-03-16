import mongoose from 'mongoose';

const facilitySchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    image: { type: String, default: '' },
    desc: { type: String, default: '' },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Facility', facilitySchema);
