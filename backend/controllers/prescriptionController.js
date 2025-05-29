import Prescription from '../models/prescriptionModel.js';
import appointmentModel from '../models/appointmentModel.js';
import userModel from '../models/userModel.js';
import doctorModel from '../models/doctorModel.js';

// Doctor uploads prescription
export const uploadPrescription = async (req, res) => {
  try {
    const { appointmentId, description } = req.body;
    const doctorId = req.doctorId;
    const appointment = await appointmentModel.findById(appointmentId);
    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });
    if (String(appointment.docId) !== String(doctorId)) return res.status(403).json({ success: false, message: 'Unauthorized' });
    if (!req.file || !req.file.path) return res.status(400).json({ success: false, message: 'No file uploaded' });
    const prescription = new Prescription({
      appointmentId,
      doctorId,
      userId: appointment.userId,
      description,
      fileUrl: req.file.path
    });
    await prescription.save();
    res.json({ success: true, message: 'Prescription uploaded', prescription });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// User or doctor fetches prescriptions for an appointment
export const getPrescriptionsByAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const prescriptions = await Prescription.find({ appointmentId });
    res.json({ success: true, prescriptions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// User fetches all their prescriptions
export const getUserPrescriptions = async (req, res) => {
  try {
    const userId = req.userId;
    const prescriptions = await Prescription.find({ userId });
    res.json({ success: true, prescriptions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Doctor updates prescription (description and/or file)
export const updatePrescription = async (req, res) => {
  try {
    const { prescriptionId } = req.params;
    const doctorId = req.doctorId;
    const { description } = req.body;
    const prescription = await Prescription.findById(prescriptionId);
    if (!prescription) return res.status(404).json({ success: false, message: 'Prescription not found' });
    if (String(prescription.doctorId) !== String(doctorId)) return res.status(403).json({ success: false, message: 'Unauthorized' });
    let updatedFields = {};
    if (description) updatedFields.description = description;
    if (req.file && req.file.path) {
      // Optionally delete old file
      const fs = await import('fs/promises');
      if (prescription.fileUrl && prescription.fileUrl !== req.file.path) {
        try { await fs.unlink(prescription.fileUrl); } catch (e) {}
      }
      updatedFields.fileUrl = req.file.path;
    }
    const updated = await Prescription.findByIdAndUpdate(prescriptionId, updatedFields, { new: true });
    res.json({ success: true, message: 'Prescription updated', prescription: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Doctor deletes prescription
export const deletePrescription = async (req, res) => {
  try {
    const { prescriptionId } = req.params;
    const doctorId = req.doctorId;
    console.log('Attempting to delete prescription:', prescriptionId, 'by doctor:', doctorId);
    const prescription = await Prescription.findById(prescriptionId);
    if (!prescription) {
      console.log('Prescription not found');
      return res.status(404).json({ success: false, message: 'Prescription not found' });
    }
    if (String(prescription.doctorId) !== String(doctorId)) {
      console.log('Unauthorized delete attempt');
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }
    // Delete file from disk
    const fs = await import('fs/promises');
    if (prescription.fileUrl) {
      try {
        await fs.unlink(prescription.fileUrl);
        console.log('Deleted file from disk:', prescription.fileUrl);
      } catch (e) {
        console.log('Failed to delete file:', prescription.fileUrl, e.message);
      }
    }
    await Prescription.findByIdAndDelete(prescriptionId);
    console.log('Prescription deleted successfully');
    res.json({ success: true, message: 'Prescription deleted' });
  } catch (error) {
    console.error('Delete prescription error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
