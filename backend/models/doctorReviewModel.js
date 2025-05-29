import mongoose from 'mongoose';

const doctorReviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'doctor',
        required: true
    },
    appointmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'appointment',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true
    },
    userJob: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Ensure a user can only leave one review per appointment
doctorReviewSchema.index({ userId: 1, appointmentId: 1 }, { unique: true });

const DoctorReview = mongoose.model('DoctorReview', doctorReviewSchema);
export default DoctorReview;
