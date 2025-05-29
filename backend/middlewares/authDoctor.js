import jwt from 'jsonwebtoken'

// Doctor authentification middleware
const authDoctor = async (req,res,next) => {
    try {
        const {dtoken} = req.headers
        if (!dtoken) {
        return res.json({success:false,message:'Not Authorized Login again'})
        }
        const token_decode = jwt.verify(dtoken,process.env.JWT_SECRET)
        req.doctorId = token_decode.id // Attach doctorId to req for downstream use
        next()
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

export default authDoctor