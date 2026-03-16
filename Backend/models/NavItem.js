import mongoose from 'mongoose';

const dropdownItemSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    href: { type: String, default: '#' },
  },
  { _id: false }
);

const navItemSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    href: { type: String, default: '#' },
    dropdown: [dropdownItemSchema],
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('NavItem', navItemSchema);
