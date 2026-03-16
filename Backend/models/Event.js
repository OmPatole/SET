import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    tag: { type: String, default: 'Event' },
    date: {
      day: { type: String, default: '' },
      month: { type: String, default: '' },
    },
    title: { type: String, required: true },
    location: { type: String, default: '' },
    desc: { type: String, default: '' },
    image: { type: String, default: '' },
    href: { type: String, default: '#' },
    active: { type: Boolean, default: true },
    eventDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model('Event', eventSchema);
