import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  program: { type: String, required: true },
  previousEducation: { type: String, required: true },
  marks: { type: String, required: true },
  message: { type: String },
  submittedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['Pending', 'Reviewed', 'Rejected', 'Accepted'], default: 'Pending' }
});

export default mongoose.model('Application', applicationSchema);
