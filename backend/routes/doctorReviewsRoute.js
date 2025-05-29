import express from 'express';
import mongoose from 'mongoose';
import DoctorReview from '../models/doctorReviewModel.js';
import appointmentModel from '../models/appointmentModel.js';
import authUser from '../middlewares/authUser.js';

const router = express.Router();

// Get all reviews for a specific doctor (frontend expects this path)
router.get('/:doctorId', async (req, res) => {
    try {
        const { doctorId } = req.params;
        // Find reviews and populate with user data
        const reviews = await DoctorReview.find({ doctorId })
            .sort({ createdAt: -1 })
            .populate('userId', 'name image'); // Get user name and image
        // Map the reviews to include userData in a more accessible format
        const reviewsWithUserData = reviews.map(review => {
            const reviewObj = review.toObject();
            reviewObj.userData = review.userId;
            return reviewObj;
        });
        res.json({ success: true, reviews: reviewsWithUserData });
    } catch (error) {
        console.error('GET /api/doctor-reviews/:doctorId error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get all reviews for a specific doctor
router.get('/doctor/:doctorId', async (req, res) => {
    try {
        const { doctorId } = req.params;
        // Find reviews and populate with user data
        const reviews = await DoctorReview.find({ doctorId })
            .sort({ createdAt: -1 })
            .populate('userId', 'name image'); // Get user name and image
            
        // Map the reviews to include userData in a more accessible format
        const reviewsWithUserData = reviews.map(review => {
            const reviewObj = review.toObject();
            reviewObj.userData = review.userId;
            return reviewObj;
        });
        
        res.json(reviewsWithUserData);
    } catch (error) {
        console.error('GET /api/doctor-reviews/doctor/:doctorId error:', error);
        res.status(500).json({ message: error.message });
    }
});

// Get all reviews by a specific user
router.get('/user', authUser, async (req, res) => {
    try {
        const { userId } = req.body;
        const reviews = await DoctorReview.find({ userId }).sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        console.error('GET /api/doctor-reviews/user error:', error);
        res.status(500).json({ message: error.message });
    }
});

// Check if user can review a specific appointment (must be completed and not already reviewed)
router.get('/can-review/:appointmentId', authUser, async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const { userId } = req.body;
        
        // Check if appointment exists and is completed
        const appointment = await appointmentModel.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }
        
        if (!appointment.isCompleted) {
            return res.json({ canReview: false, message: 'Appointment is not completed yet' });
        }
        
        // Check if user already reviewed this appointment
        const existingReview = await DoctorReview.findOne({ userId, appointmentId });
        
        res.json({ 
            canReview: !existingReview,
            message: existingReview ? 'You have already reviewed this appointment' : 'You can review this appointment'
        });
    } catch (error) {
        console.error('GET /api/doctor-reviews/can-review/:appointmentId error:', error);
        res.status(500).json({ message: error.message });
    }
});

// Create a new doctor review
router.post('/', authUser, async (req, res) => {
    try {
        const { userId, doctorId, appointmentId, rating, comment } = req.body;
        
        // Verify the appointment exists, belongs to this user, and is completed
        const appointment = await appointmentModel.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }
        
        if (String(appointment.userId) !== String(userId)) {
            return res.status(403).json({ message: 'This appointment does not belong to you' });
        }
        
        if (!appointment.isCompleted) {
            return res.status(400).json({ message: 'Cannot review an incomplete appointment' });
        }
        
        // Check if user already reviewed this appointment
        const existingReview = await DoctorReview.findOne({ userId, appointmentId });
        if (existingReview) {
            return res.status(400).json({ message: 'You have already reviewed this appointment' });
        }
        
        const review = new DoctorReview({
            userId,
            doctorId,
            appointmentId,
            rating,
            comment
        });
        
        const newReview = await review.save();
        res.status(201).json(newReview);
    } catch (error) {
        console.error('POST /api/doctor-reviews error:', error);
        res.status(500).json({ message: error.message });
    }
});

// Edit a review (only by the owner)
router.put('/:id', authUser, async (req, res) => {
    try {
        const { userId, rating, comment } = req.body;
        const review = await DoctorReview.findById(req.params.id);
        
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        
        if (String(review.userId) !== String(userId)) {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        
        review.rating = rating;
        review.comment = comment;
        
        await review.save();
        res.json(review);
    } catch (error) {
        console.error('PUT /api/doctor-reviews/:id error:', error);
        res.status(500).json({ message: error.message });
    }
});

// Delete a review (only by the owner)
router.delete('/:id', authUser, async (req, res) => {
    try {
        const { userId } = req.body;
        const review = await DoctorReview.findById(req.params.id);
        
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        
        if (String(review.userId) !== String(userId)) {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        
        await review.deleteOne();
        res.json({ message: 'Review deleted successfully' });
    } catch (error) {
        console.error('DELETE /api/doctor-reviews/:id error:', error);
        res.status(500).json({ message: error.message });
    }
});

// Get average rating for a doctor
router.get('/rating/:doctorId', async (req, res) => {
    try {
        const { doctorId } = req.params;
        
        const result = await DoctorReview.aggregate([
            { $match: { doctorId: new mongoose.Types.ObjectId(doctorId) } },
            { 
                $group: { 
                    _id: null, 
                    averageRating: { $avg: "$rating" },
                    reviewCount: { $sum: 1 }
                } 
            }
        ]);
        
        if (result.length === 0) {
            return res.json({ averageRating: 0, reviewCount: 0 });
        }
        
        res.json({
            averageRating: parseFloat(result[0].averageRating.toFixed(1)),
            reviewCount: result[0].reviewCount
        });
    } catch (error) {
        console.error('GET /api/doctor-reviews/rating/:doctorId error:', error);
        res.status(500).json({ message: error.message });
    }
});

export default router;
