import doctorModel from "../models/doctorModel.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import appointmentModel from "../models/appointmentModel.js"
const changeAvailability = async (req,res) => {
   try{
    const {docId} = req.body
    const docData = await doctorModel.findById(docId)
    await doctorModel.findByIdAndUpdate(docId,{available: !docData.available})
     res.json({success:true , message: 'Availability '})
   } catch (error) {
    console.log(error)
    res.json({success:false,message:error.message})
   }
}
const DoctorReview = (await import('../models/doctorReviewModel.js')).default;
const doctorList = async (req,res)=>{
   try {
      const doctors = await doctorModel.find({}).select(['-password' , '-email'])
      // Attach rating and reviewCount to each doctor
      const doctorsWithRatings = await Promise.all(doctors.map(async doc => {
        const reviews = await DoctorReview.find({ doctorId: doc._id });
        const avgRating = reviews.length > 0
          ? reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / reviews.length
          : 0;
        return {
          ...doc.toObject(),
          rating: avgRating,
          reviewCount: reviews.length
        };
      }));
      res.json({success:true,doctors: doctorsWithRatings})
   } catch (error) {
      console.log(error)
    res.json({success:false,message:error.message})
   }
}
// api for doctor login 
const loginDoctor = async (req,res) => {
   try {
      const { email, password } = req.body
      const doctor = await doctorModel.findOne({email})
      if (!doctor) {
         return res.json({success:false,message:'Invalid Credentials'})
      }
      const isMatch = await bcrypt.compare(password , doctor.password)
      if (isMatch) {
         const token = jwt.sign({id:doctor._id},process.env.JWT_SECRET)
         res.json({success:true,token})
      } else {
       res.json({success:false,message:'Invalid Credentials'})   
      }
   } catch (error) {
    console.log(error)
    res.json({success:false,message:error.message})
   }
}
// api to get doctor appointments ( to the doctor panel )
const appointmentsDoctor = async (req,res) => {
   try {
      const docId = req.doctorId; 
      const appointments = await appointmentModel.find({docId})
      res.json({success:true,appointments})
   } catch (error) {
      console.log(error)
    res.json({success:false,message:error.message})
   }
}
// api to answer the appointment ( accepter par le docteur )
const appointmentComplete = async (req,res) =>{
   try {
      const docId = req.doctorId;
      const { appointmentId } = req.body;
      const appointmentData = await appointmentModel.findById(appointmentId)
      if (appointmentData && appointmentData.docId === docId) {
         await appointmentModel.findByIdAndUpdate(appointmentId , {isCompleted:true})
      return res.json({success:true,message:'Appointment Approved'})
      } else {
         res.json({success:false,message:' Acceptance Failed '})
      }
   } catch (error) {
      console.log(error)
    res.json({success:false,message:error.message})
   }
}
// api to cancel the appointment (refuser par le docteur )
const appointmentCancel = async (req,res) =>{
   try {
      const docId = req.doctorId;
      const { appointmentId } = req.body;
      const appointmentData = await appointmentModel.findById(appointmentId)
      if (appointmentData && appointmentData.docId === docId) {
         await appointmentModel.findByIdAndUpdate(appointmentId , {cancelled:true})
      return res.json({success:true,message:'Appointment Canceled'})
      } else {
         res.json({success:false,message:' Cancellation Failed '})
      }
   } catch (error) {
    console.log(error)
    res.json({success:false,message:error.message})
   }
}
// api to get dashboard data ( pour le docteur)
const doctorDashboard = async (req,res) => {
   try {
     const docId = req.doctorId;
     const appointments = await appointmentModel.find({docId})  
     let earnings = 0
     appointments.map((item)=>{
       if (item.isCompleted || item.payment) {
         earnings += item.amount
       }
     })
     let patients = []
     appointments.map((item)=>{
       if (!patients.includes(item.userId)) {
         patients.push(item.userId)
       }
     })
     const dashData = {
      earnings ,
      appointments: appointments.length , 
      patients: patients.length , 
      latestAppointments: appointments.reverse().slice(0,5)
     }
     res.json({success:true,dashData})
   } catch (error) {
      console.log(error)
    res.json({success:false,message:error.message})
   }
}
// api for the doctor profile (doctor panel ) 
const doctorProfile = async (req,res)=>{
try {
   const docId = req.doctorId;
   const profileData = await doctorModel.findById(docId).select('-password')
   res.json({success:true,profileData})
} catch (error) {
   console.log(error)
    res.json({success:false,message:error.message})
}
}
// api to update doctor profile ( mise a jour pour le profile docteur)
const updateDoctorProfile = async (req,res) => {
try {
   const {docId , fees , address , available } = req.body
   await doctorModel.findByIdAndUpdate(docId , {fees , address , available})
   res.json({success:true , message:'Profile Updated'})
} catch (error) {
   console.log(error)
    res.json({success:false,message:error.message})
}
}

export {changeAvailability,doctorList,loginDoctor,appointmentsDoctor , appointmentComplete,appointmentCancel, doctorDashboard, doctorProfile , updateDoctorProfile}