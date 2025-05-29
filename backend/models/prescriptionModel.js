import mongoose from 'mongoose';

const prescriptionSchema = new mongoose.Schema({
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  description: { type: String },
  fileUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Prescription', prescriptionSchema);
