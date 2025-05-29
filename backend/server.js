import express from 'express'
import cors from 'cors'
import path from 'path'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import adminRouter from './routes/adminRoute.js'
import doctorRouter from './routes/doctorRoute.js'
import userRouter from './routes/userRoute.js'
import paymentRoutes from './routes/paymentRoutes.js'
import reviewsRouter from './routes/reviewsRoute.js'
import prescriptionRoute from './routes/prescriptionRoute.js'
import doctorReviewsRouter from './routes/doctorReviewsRoute.js'
import blogRoute from './routes/blogRoute.js'

//app config 
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

// middlewares
app.use(express.json())
app.use(cors())

// Serve static files from /tmp for prescriptions
app.use('/tmp', express.static('/tmp'));
// Serve static files from /uploads for blog images
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// api endpoints
 app.use('/api/admin' , adminRouter)
 app.use('/api/doctor' , doctorRouter)
 app.use('/api/user' , userRouter)
 app.use('/api/payments', paymentRoutes)
 app.use('/api/reviews', reviewsRouter)
 app.use('/api/prescriptions', prescriptionRoute)
 app.use('/api/doctor-reviews', doctorReviewsRouter)
 app.use('/api/blog', blogRoute);

app.get('/', (req,res)=>{
  res.send('API WORKING')
})

app.listen(port , ()=> console.log("Server Started",port))
