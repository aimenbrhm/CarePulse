import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaStar, FaStarHalfAlt, FaRegStar, FaPencilAlt, FaUser } from 'react-icons/fa';
import { format } from 'date-fns';
import { toast } from 'react-toastify';

const DoctorReviews = ({ doctorId, refreshTrigger = 0 }) => {
  const { backendUrl, token, userData } = useContext(AppContext);
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [userCompletedAppointments, setUserCompletedAppointments] = useState([]);
  const [canReview, setCanReview] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState('');
  const [editHover, setEditHover] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (doctorId) {
      fetchReviews();
      fetchAverageRating();
      if (token) {
        checkUserCanReview();
      }
    }
  }, [doctorId, token]);

  // Refresh reviews when refreshTrigger changes
  useEffect(() => {
    if (refreshTrigger > 0 && doctorId) {
      fetchReviews();
      fetchAverageRating();
    }
  }, [refreshTrigger]);

  // Update the rating summary in the doctor profile section
  useEffect(() => {
    const updateRatingSummary = () => {
      const ratingSummaryElement = document.getElementById('doctor-rating-summary');
      if (ratingSummaryElement) {
        // Create a container for the rating
        const container = document.createElement('div');
        container.className = 'flex items-center';
        
        // Create stars container
        const starsContainer = document.createElement('div');
        starsContainer.className = 'flex mr-1';
        
        // Add stars based on rating
        const fullStars = Math.floor(averageRating);
        const hasHalfStar = averageRating % 1 >= 0.5;
        
        for (let i = 1; i <= 5; i++) {
          const star = document.createElement('span');
          star.className = 'mr-1';
          
          if (i <= fullStars) {
            star.innerHTML = '<svg stroke="currentColor" fill="#FFD700" stroke-width="0" viewBox="0 0 576 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"></path></svg>';
          } else if (i === fullStars + 1 && hasHalfStar) {
            star.innerHTML = '<svg stroke="currentColor" fill="#FFD700" stroke-width="0" viewBox="0 0 536 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M508.55 171.51L362.18 150.2 296.77 17.81C290.89 5.98 279.42 0 267.95 0c-11.4 0-22.79 5.9-28.69 17.81l-65.43 132.38-146.38 21.29c-26.25 3.8-36.77 36.09-17.74 54.59l105.89 103-25.06 145.48C86.98 495.33 103.57 512 122.15 512c4.93 0 10-1.17 14.87-3.75l130.95-68.68 130.94 68.7c4.86 2.55 9.92 3.71 14.83 3.71 18.6 0 35.22-16.61 31.66-37.4l-25.03-145.49 105.91-102.98c19.04-18.5 8.52-50.8-17.73-54.6zm-121.74 123.2l-18.12 17.62 4.28 24.88 19.52 113.45-102.13-53.59-22.38-11.74.03-317.19 51.03 103.29 11.18 22.63 25.01 3.64 114.23 16.63-82.65 80.38z"></path></svg>';
          } else {
            star.innerHTML = '<svg stroke="currentColor" fill="#e4e5e9" stroke-width="0" viewBox="0 0 576 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"></path></svg>';
          }
          
          starsContainer.appendChild(star);
        }
        
        // Add rating text
        const ratingText = document.createElement('span');
        ratingText.className = 'text-sm font-medium';
        ratingText.textContent = averageRating.toFixed(1);
        
        // Add review count
        const countText = document.createElement('span');
        countText.className = 'text-xs text-gray-500 ml-1';
        countText.textContent = `(${reviewCount})`;
        
        // Assemble the elements
        container.appendChild(starsContainer);
        container.appendChild(ratingText);
        container.appendChild(countText);
        
        // Clear and update the rating summary
        ratingSummaryElement.innerHTML = '';
        ratingSummaryElement.appendChild(container);
      }
    };
    
    if (doctorId && !loading) {
      updateRatingSummary();
    }
  }, [averageRating, reviewCount, loading, doctorId]);
  
  const checkUserCanReview = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/user/appointments`, 
        { headers: { token } }
      );
      
      if (data.success) {
        // Filter appointments with this doctor that are completed
        const completedWithDoctor = data.appointments.filter(
          app => app.docId === doctorId && app.isCompleted && !app.cancelled
        );
        
        setUserCompletedAppointments(completedWithDoctor);
        setCanReview(completedWithDoctor.length > 0);
      }
    } catch (error) {
      console.error('Error checking if user can review:', error);
    }
  };
  
  const handleAddReview = () => {
    navigate('/my-appointments');
  };
  
  const handleEditReview = (review) => {
    setEditingReview(review);
    setEditRating(review.rating);
    setEditComment(review.comment);
    setIsEditing(true);
  };
  
  const handleCancelEdit = () => {
    setEditingReview(null);
    setIsEditing(false);
  };
  
  const handleUpdateReview = async () => {
    if (!editingReview || !token) return;
    
    try {
      await axios.put(
        `${backendUrl}/api/doctor-reviews/${editingReview._id}`,
        {
          rating: editRating,
          comment: editComment
        },
        { headers: { token } }
      );
      
      toast.success('Review updated successfully');
      setIsEditing(false);
      setEditingReview(null);
      fetchReviews();
      fetchAverageRating();
    } catch (error) {
      console.error('Error updating review:', error);
      toast.error(error.response?.data?.message || 'Failed to update review');
    }
  };
  
  const handleDeleteReview = async (reviewId) => {
    if (!token) return;
    
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }
    
    try {
      await axios.delete(
        `${backendUrl}/api/doctor-reviews/${reviewId}`,
        { headers: { token } }
      );
      
      toast.success('Review deleted successfully');
      fetchReviews();
      fetchAverageRating();
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error(error.response?.data?.message || 'Failed to delete review');
    }
  };

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/doctor-reviews/doctor/${doctorId}`);
      console.log('Reviews data:', data);
      console.log('Current user:', userData);
      setReviews(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching doctor reviews:', error);
      setLoading(false);
    }
  };

  const fetchAverageRating = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor-reviews/rating/${doctorId}`);
      setAverageRating(data.averageRating);
      setReviewCount(data.reviewCount);
    } catch (error) {
      console.error('Error fetching average rating:', error);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400 text-sm" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400 text-sm" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-gray-300 text-sm" />);
      }
    }

    return stars;
  };

  if (loading) {
    return <div className="text-center py-4">Loading reviews...</div>;
  }

  return (
    <div className="mt-6">

      {/* Edit Review Form */}
      {isEditing && editingReview && (
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium mb-3 dark:text-white">Edit Your Review</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Rating
            </label>
            <div className="flex">
              {[...Array(5)].map((_, index) => {
                const ratingValue = index + 1;
                return (
                  <label key={index} className="cursor-pointer">
                    <input
                      type="radio"
                      name="editRating"
                      className="hidden"
                      value={ratingValue}
                      onClick={() => setEditRating(ratingValue)}
                    />
                    <FaStar
                      size={24}
                      className="mr-1 transition-colors duration-200"
                      color={ratingValue <= (editHover || editRating) ? "#FFD700" : "#e4e5e9"}
                      onMouseEnter={() => setEditHover(ratingValue)}
                      onMouseLeave={() => setEditHover(null)}
                    />
                  </label>
                );
              })}
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Your Review
            </label>
            <textarea
              className="w-full p-3 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              rows="3"
              value={editComment}
              onChange={(e) => setEditComment(e.target.value)}
              required
            ></textarea>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={handleUpdateReview}
              className="bg-primary text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors duration-300"
            >
              Update Review
            </button>
            <button
              onClick={handleCancelEdit}
              className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors duration-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {reviews.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No reviews yet for this doctor.</p>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review._id} className="border-b pb-5 dark:border-gray-700">
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden flex items-center justify-center mr-3 flex-shrink-0">
                  {review.userData?.image ? (
                    <img src={review.userData.image} alt="User" className="w-full h-full object-cover" />
                  ) : (
                    <FaUser className="text-gray-400 text-lg" />
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex flex-wrap items-center mb-1">
                        <span className="font-medium text-gray-800 dark:text-white mr-2">
                          {review.userData?.name || 'Anonymous User'}
                        </span>
                        {review.userJob && (
                          <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                            {review.userJob}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex mb-2">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                    
                    {/* Edit/Delete buttons */}
                    {token && (
                      <div className="flex space-x-1">
                        <button 
                          onClick={() => handleEditReview(review)}
                          className="text-gray-500 hover:text-primary p-1 rounded-full transition-colors duration-200"
                          title="Edit review"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button 
                          onClick={() => handleDeleteReview(review._id)}
                          className="text-gray-500 hover:text-red-500 p-1 rounded-full transition-colors duration-200"
                          title="Delete review"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-gray-700 dark:text-gray-300 mb-2">{review.comment}</p>
                  
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {format(new Date(review.createdAt), 'MMMM d, yyyy')}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorReviews;
