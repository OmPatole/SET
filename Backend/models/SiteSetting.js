import mongoose from 'mongoose';

// Stores all site-wide settings as key-value pairs
const siteSettingSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    value: { type: mongoose.Schema.Types.Mixed, required: true },
    group: { type: String, default: 'general' },
    label: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('SiteSetting', siteSettingSchema);
