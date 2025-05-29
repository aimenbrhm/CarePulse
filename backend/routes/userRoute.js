import express from 'express'
import { registerUser, loginUser, getProfile , updateProfile, bookAppointment, listAppointment, cancelAppointment } from '../controllers/userContoller.js'
import { upsertMedicalRecord, getMedicalRecord, addMedicalRecordItem, updateMedicalRecordItem, deleteMedicalRecordItem } from '../controllers/medicalRecordController.js'
import authUser from '../middlewares/authUser.js'
import upload from '../middlewares/multer.js'

const userRouter = express.Router()

userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)
userRouter.get('/get-profile',authUser,getProfile)
userRouter.post('/update-profile',upload.single('image'),authUser,updateProfile)
userRouter.post('/book-appointment',authUser,bookAppointment)
userRouter.get('/appointments',authUser,listAppointment)
userRouter.post('/cancel-appointment',authUser,cancelAppointment)

// Medical Record endpoints
userRouter.post('/medical-record', authUser, upsertMedicalRecord)
userRouter.get('/medical-record', authUser, getMedicalRecord)
userRouter.post('/medical-record/add-item', authUser, addMedicalRecordItem)
userRouter.post('/medical-record/update-item', authUser, updateMedicalRecordItem)
userRouter.post('/medical-record/delete-item', authUser, deleteMedicalRecordItem)

export default userRouter