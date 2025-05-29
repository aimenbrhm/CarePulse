import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { AppContext } from '../context/AppContext';

const Reviews = () => {
    const { token, userData } = useContext(AppContext);
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({
        name: '',
        role: '',
        rating: 5,
        quote: ''
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const response = await axios.get('/api/reviews');
            setReviews(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            setReviews([]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!token || !userData) {
            toast.error('You must be logged in to submit a review');
            return;
        }
        if (!newReview.name.trim() || !newReview.role.trim() || !newReview.quote.trim()) {
            toast.error('Please fill in all fields.');
            return;
        }
        setSubmitting(true);
        try {
            await axios.post('/api/reviews', { ...newReview, userId: userData._id }, { headers: { token } });
            setNewReview({ name: '', role: '', rating: 5, quote: '' });
            toast.success('Review submitted!');
            fetchReviews();
        } catch (error) {
            toast.error('Failed to submit review');
        } finally {
            setSubmitting(false);
        }
    };

    // Edit & delete logic
    const [editingId, setEditingId] = useState(null);
    const [editReview, setEditReview] = useState({ name: '', role: '', rating: 5, quote: '' });

    const startEdit = (review) => {
        setEditingId(review._id);
        setEditReview({ name: review.name, role: review.role, rating: review.rating, quote: review.quote });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditReview({ name: '', role: '', rating: 5, quote: '' });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        if (!token || !userData) return;
        try {
            await axios.put(`/api/reviews/${editingId}`, { ...editReview, userId: userData._id }, { headers: { token } });
            toast.success('Review updated!');
            setEditingId(null);
            setEditReview({ name: '', role: '', rating: 5, quote: '' });
            fetchReviews();
        } catch {
            toast.error('Failed to update review');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this review?')) return;
        try {
            await axios.delete(`/api/reviews/${id}`, { data: { userId: userData._id }, headers: { token } });
            toast.success('Review deleted!');
            fetchReviews();
        } catch {
            toast.error('Failed to delete review');
        }
    };


    return (
        <section className="py-16 bg-gray-50 dark:bg-gray-900 dark:text-gray-100 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4"
                    >
                        What Our Patients Say
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
                    >
                        Don't just take our word for it - hear from our community. Leave your own review below!
                    </motion.p>
                </div>

                <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 mb-12">
                    <h3 className="text-xl font-semibold mb-4">Share Your Experience</h3>
                    {!token && (
                        <div className="mb-4 text-red-500 font-medium">You must be logged in to submit a review.</div>
                    )}
                    {token && (
                        <>
                            <div className="mb-4">
                                <label className="block font-medium mb-1">Name</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#5f6FFF] focus:border-transparent bg-white text-gray-800 dark:bg-gray-700 dark:text-white"
                                    value={newReview.name}
                                    onChange={e => setNewReview({ ...newReview, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block font-medium mb-1">Role</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#5f6FFF] focus:border-transparent bg-white text-gray-800 dark:bg-gray-700 dark:text-white"
                                    value={newReview.role}
                                    onChange={e => setNewReview({ ...newReview, role: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block font-medium mb-1">Rating</label>
                                <select
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#5f6FFF] focus:border-transparent bg-white text-gray-800 dark:bg-gray-700 dark:text-white"
                                    value={newReview.rating}
                                    onChange={e => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                                    required
                                >
                                    {[5,4,3,2,1].map(val => <option key={val} value={val}>{val}</option>)}
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block font-medium mb-1">Quote</label>
                                <textarea
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#5f6FFF] focus:border-transparent bg-white text-gray-800 dark:bg-gray-700 dark:text-white"
                                    rows={3}
                                    value={newReview.quote}
                                    onChange={e => setNewReview({ ...newReview, quote: e.target.value })}
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-[#5f6FFF] text-white py-2 rounded-lg font-semibold hover:bg-[#4b54c6] transition-colors disabled:opacity-60"
                                disabled={submitting}
                            >
                                {submitting ? 'Submitting...' : 'Submit Review'}
                            </button>
                        </>
                    )}
                </form>

                <div className="grid md:grid-cols-3 gap-8">
                    {reviews.map((testimonial, index) => (
                        <motion.div
                            key={testimonial._id || index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2, duration: 0.5 }}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md p-6 flex flex-col items-start"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center font-bold text-xl text-[#5f6FFF]">
                                    {testimonial.name ? testimonial.name[0].toUpperCase() : '?'}
                                </div>
                                <div>
                                    <div className="font-semibold text-lg">{testimonial.name}</div>
                                    <div className="text-gray-500 dark:text-gray-400 text-sm">{testimonial.role}</div>
                                </div>
                            </div>
                            <div className="flex items-center mb-2">
                                {[...Array(5)].map((_, i) => (
                                    <span key={i} className={i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}>★</span>
                                ))}
                            </div>
                            <blockquote className="text-gray-700 dark:text-gray-200 italic">"{testimonial.quote}"</blockquote>
                            {userData && testimonial.userId === userData._id && (
    <div className="mt-4 flex gap-2">
        <button className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500" onClick={() => startEdit(testimonial)}>Edit</button>
        <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600" onClick={() => handleDelete(testimonial._id)}>Delete</button>
    </div>
)}
{editingId === testimonial._id && (
    <form onSubmit={handleEditSubmit} className="w-full mt-4 bg-gray-100 dark:bg-gray-900 p-4 rounded">
        <input className="w-full mb-2 px-2 py-1 rounded text-black" type="text" value={editReview.name} onChange={e => setEditReview({ ...editReview, name: e.target.value })} required />
        <input className="w-full mb-2 px-2 py-1 rounded text-black" type="text" value={editReview.role} onChange={e => setEditReview({ ...editReview, role: e.target.value })} required />
        <select className="w-full mb-2 px-2 py-1 rounded text-black" value={editReview.rating} onChange={e => setEditReview({ ...editReview, rating: Number(e.target.value) })} required>
            {[5,4,3,2,1].map(val => <option key={val} value={val}>{val}</option>)}
        </select>
        <textarea className="w-full mb-2 px-2 py-1 rounded text-black" value={editReview.quote} onChange={e => setEditReview({ ...editReview, quote: e.target.value })} required />
        <div className="flex gap-2">
            <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">Save</button>
            <button type="button" className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500" onClick={cancelEdit}>Cancel</button>
        </div>
    </form>
)}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Reviews;
