import MedicalRecord from '../models/medicalRecordModel.js';
import userModel from '../models/userModel.js';

// Add item to a section of the medical record
export const addMedicalRecordItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { section, item } = req.body;
    if (!section || !item) return res.status(400).json({ success: false, message: 'Missing section or item' });
    let record = await MedicalRecord.findOne({ user: userId });
    if (!record) record = await MedicalRecord.create({ user: userId });
    record[section].push(item);
    await record.save();
    res.json({ success: true, record });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update item in a section of the medical record
export const updateMedicalRecordItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { section, itemIndex, item } = req.body;
    if (!section || itemIndex === undefined || !item) return res.status(400).json({ success: false, message: 'Missing section, itemIndex, or item' });
    let record = await MedicalRecord.findOne({ user: userId });
    if (!record) return res.status(404).json({ success: false, message: 'Medical record not found' });
    record[section][itemIndex] = item;
    await record.save();
    res.json({ success: true, record });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete item from a section of the medical record
export const deleteMedicalRecordItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { section, itemIndex } = req.body;
    if (!section || itemIndex === undefined) return res.status(400).json({ success: false, message: 'Missing section or itemIndex' });
    let record = await MedicalRecord.findOne({ user: userId });
    if (!record) return res.status(404).json({ success: false, message: 'Medical record not found' });
    record[section].splice(itemIndex, 1);
    await record.save();
    res.json({ success: true, record });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Create or update medical record
export const upsertMedicalRecord = async (req, res) => {
  try {
    const userId = req.user._id;
    const data = req.body;
    let record = await MedicalRecord.findOne({ user: userId });
    if (record) {
      record.firstName = data.firstName || '';
      record.lastName = data.lastName || '';
      record.dateOfBirth = data.dateOfBirth || null;
      record.gender = data.gender || '';
      record.address1 = data.address1 || '';
      record.address2 = data.address2 || '';
      record.previousIllnesses = Array.isArray(data.previousIllnesses) ? data.previousIllnesses.join(', ') : (data.previousIllnesses || '');
      record.familyHistory = Array.isArray(data.familyHistory) ? data.familyHistory.join(', ') : (data.familyHistory || '');
      record.currentMedications = Array.isArray(data.currentMedications) ? data.currentMedications.join(', ') : (data.currentMedications || '');
      record.previousMedications = Array.isArray(data.previousMedications) ? data.previousMedications.join(', ') : (data.previousMedications || '');
      record.allergies = Array.isArray(data.allergies) ? data.allergies.join(', ') : (data.allergies || '');
      record.surgeries = Array.isArray(data.surgeries) ? data.surgeries.join(', ') : (data.surgeries || '');
      record.notes = data.notes || '';
      record.bloodType = data.bloodType || '';
      record.height = data.height === '' ? null : data.height;
      record.weight = data.weight === '' ? null : data.weight;
      record.emergencyContact = data.emergencyContact || '';
      record.chronicDiseases = data.chronicDiseases || '';
      record.immunizations = data.immunizations || '';
      await record.save();
    } else {
      record = await MedicalRecord.create({
        user: userId,
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        dateOfBirth: data.dateOfBirth || null,
        gender: data.gender || '',
        address1: data.address1 || '',
        address2: data.address2 || '',
        previousIllnesses: Array.isArray(data.previousIllnesses) ? data.previousIllnesses.join(', ') : (data.previousIllnesses || ''),
        familyHistory: Array.isArray(data.familyHistory) ? data.familyHistory.join(', ') : (data.familyHistory || ''),
        currentMedications: Array.isArray(data.currentMedications) ? data.currentMedications.join(', ') : (data.currentMedications || ''),
        previousMedications: Array.isArray(data.previousMedications) ? data.previousMedications.join(', ') : (data.previousMedications || ''),
        allergies: Array.isArray(data.allergies) ? data.allergies.join(', ') : (data.allergies || ''),
        surgeries: Array.isArray(data.surgeries) ? data.surgeries.join(', ') : (data.surgeries || ''),
        notes: Array.isArray(data.notes) ? data.notes.join(', ') : (data.notes || ''),
        bloodType: data.bloodType || '',
        height: data.height === '' ? null : data.height,
        weight: data.weight === '' ? null : data.weight,
        emergencyContact: data.emergencyContact || '',
        chronicDiseases: data.chronicDiseases || '',
        immunizations: data.immunizations || ''
      });
    }
    res.json({ success: true, record });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get medical record
export const getMedicalRecord = async (req, res) => {
  try {
    const userId = req.user._id;
    const record = await MedicalRecord.findOne({ user: userId });
    if (!record) return res.json({ success: true, record: null });
    res.json({ success: true, record });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
