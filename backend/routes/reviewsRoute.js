import express from 'express';
import Review from '../models/reviewModel.js';
import authUser from '../middlewares/authUser.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const reviews = await Review.find().sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        console.error('GET /api/reviews error:', error);
        res.status(500).json({ message: error.message });
    }
});

router.post('/', authUser, async (req, res) => {
    try {
        const { name, role, rating, quote, userId } = req.body;
        const review = new Review({
            userId,
            name,
            role,
            rating,
            quote
        });
        const newReview = await review.save();
        res.status(201).json(newReview);
    } catch (error) {
        console.error('POST /api/reviews error:', error);
        res.status(500).json({ message: error.message });
    }
});

// Edit review (only by owner)
router.put('/:id', authUser, async (req, res) => {
    try {
        const { name, role, rating, quote, userId } = req.body;
        const review = await Review.findById(req.params.id);
        if (!review) return res.status(404).json({ message: 'Review not found' });
        if (String(review.userId) !== String(userId)) {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        review.name = name;
        review.role = role;
        review.rating = rating;
        review.quote = quote;
        await review.save();
        res.json(review);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete review (only by owner)
router.delete('/:id', authUser, async (req, res) => {
    try {
        const { userId } = req.body;
        const review = await Review.findById(req.params.id);
        if (!review) return res.status(404).json({ message: 'Review not found' });
        if (String(review.userId) !== String(userId)) {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        await review.deleteOne();
        res.json({ message: 'Review deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
