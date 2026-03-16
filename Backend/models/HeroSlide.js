import mongoose from 'mongoose';

const ctaSchema = new mongoose.Schema(
  { label: { type: String, default: '' }, href: { type: String, default: '#' } },
  { _id: false }
);

const heroSlideSchema = new mongoose.Schema(
  {
    image: { type: String, required: true },
    tag: { type: String, default: '' },
    title: { type: String, required: true },
    subtitle: { type: String, default: '' },
    cta1: { type: ctaSchema, default: () => ({}) },
    cta2: { type: ctaSchema, default: () => ({}) },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('HeroSlide', heroSlideSchema);
