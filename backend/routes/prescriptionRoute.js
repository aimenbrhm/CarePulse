import express from 'express';
import { uploadPrescription, getPrescriptionsByAppointment, getUserPrescriptions, updatePrescription, deletePrescription } from '../controllers/prescriptionController.js';
import upload from '../middlewares/multer.js';
import authDoctor from '../middlewares/authDoctor.js';
import authUser from '../middlewares/authUser.js';

const router = express.Router();

// Doctor uploads prescription (file upload)
router.post('/upload', authDoctor, upload.single('file'), uploadPrescription);
// Get prescriptions for an appointment (doctor/user)
router.get('/appointment/:appointmentId', getPrescriptionsByAppointment);
// User gets all their prescriptions
router.get('/user/all', authUser, getUserPrescriptions);

// Doctor updates prescription (description and/or file)
router.put('/update/:prescriptionId', authDoctor, upload.single('file'), updatePrescription);
// Doctor deletes prescription
router.delete('/delete/:prescriptionId', authDoctor, deletePrescription);

export default router;
