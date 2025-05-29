import mongoose from 'mongoose';

const medicalRecordSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true, unique: true },
  firstName: { type: String, default: '' },
  lastName: { type: String, default: '' },
  dateOfBirth: { type: Date, default: null },
  gender: { type: String, default: '' },
  address1: { type: String, default: '' },
  address2: { type: String, default: '' },
  previousIllnesses: { type: String, default: '' },
  familyHistory: { type: String, default: '' },
  currentMedications: { type: String, default: '' },
  previousMedications: { type: String, default: '' },
  allergies: { type: String, default: '' },
  surgeries: { type: String, default: '' },
  bloodType: { type: String, default: '' },
  height: { type: Number, default: null },
  weight: { type: Number, default: null },
  emergencyContact: { type: String, default: '' },
  chronicDiseases: { type: String, default: '' },
  immunizations: { type: String, default: '' },
  notes: { type: String, default: '' }
});

const MedicalRecord = mongoose.models.medicalRecord || mongoose.model('medicalRecord', medicalRecordSchema);

export default MedicalRecord;
