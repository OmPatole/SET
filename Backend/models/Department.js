import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    type: { type: String, enum: ['B.Tech', 'M.Tech', 'PhD', 'Other'], default: 'B.Tech' },
    duration: { type: String, default: '4 Years' },
    intake: { type: Number, default: 60 },
    image: { type: String, default: '' },
    desc: { type: String, default: '' },
    tags: [{ type: String }],
    color: { type: String, default: 'bg-blue-500' },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Department', departmentSchema);
