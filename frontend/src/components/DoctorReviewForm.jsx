import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaStar, FaUser, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const DoctorReviewForm = ({ doctorId, onReviewSubmitted }) => {
  const { backendUrl, token, userData } = useContext(AppContext);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hover, setHover] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userCompletedAppointments, setUserCompletedAppointments] = useState([]);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState('');
  const [userJob, setUserJob] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (token && doctorId) {
      fetchUserCompletedAppointments();
    }
  }, [token, doctorId]);

  const fetchUserCompletedAppointments = async () => {
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
        
        // Auto-select the first appointment if available
        if (completedWithDoctor.length > 0) {
          setSelectedAppointmentId(completedWithDoctor[0]._id);
        }
      }
    } catch (error) {
      console.error('Error fetching completed appointments:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!token) {
      toast.error('Please login to submit a review');
      return;
    }
    
    if (!selectedAppointmentId) {
      toast.error('Please select an appointment');
      return;
    }
    
    if (rating < 1 || !comment.trim()) {
      toast.error('Please provide both rating and comment');
      return;
    }

    setLoading(true);
    
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/doctor-reviews`,
        {
          doctorId,
          appointmentId: selectedAppointmentId,
          rating,
          comment,
          userJob: userJob.trim() || undefined
        },
        { headers: { token } }
      );

      toast.success('Review submitted successfully');
      setComment('');
      
      // Refresh the list of appointments that can be reviewed
      fetchUserCompletedAppointments();
      
      if (onReviewSubmitted) {
        onReviewSubmitted(data);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  // If not logged in, don't show the form
  if (!token) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm mb-6 overflow-hidden transition-all duration-300">
      {/* Collapsible Header - Always visible */}
      <div 
        className="p-4 flex items-center justify-between cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors rounded-lg"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden flex items-center justify-center mr-3">
            {userData?.image ? (
              <img src={userData.image} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <FaUser className="text-gray-400 text-lg" />
            )}
          </div>
          <div>
            <div className="font-medium text-gray-900 dark:text-gray-100">
              {isExpanded ? 'Write your review' : 'Click to write a review'}
            </div>
            <div className="text-sm text-gray-600 dark:text-blue-300">
              {userData?.name || 'Anonymous User'}
            </div>
          </div>
        </div>
        <div className="text-gray-500 dark:text-blue-300">
          {isExpanded ? <FaChevronUp size={18} /> : <FaChevronDown size={18} />}
        </div>
      </div>
      
      {/* Expandable Content */}
      <div 
        className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="p-5 border-t border-gray-100 dark:border-gray-700">
          {/* User Profile Section - Clean and minimal */}
          <div className="mb-6">
            <div className="flex items-center">
              <div className="flex-1">
                <div className="mt-1 relative">
                  <input
                    type="text"
                    placeholder="Your profession (optional)"
                    value={userJob}
                    onChange={(e) => setUserJob(e.target.value)}
                    className="text-sm text-gray-900 dark:text-gray-100 bg-transparent border-0 border-b border-gray-200 dark:border-gray-600 focus:ring-0 focus:border-primary dark:focus:border-blue-400 w-full py-1 px-0 placeholder-gray-500 dark:placeholder-gray-400"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
            {userCompletedAppointments.length > 1 && (
              <div className="mb-4 hidden">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Appointment
                </label>
                <select
                  value={selectedAppointmentId}
                  onChange={(e) => setSelectedAppointmentId(e.target.value)}
                  className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                >
                  {userCompletedAppointments.map((app) => (
                    <option key={app._id} value={app._id}>
                      {new Date(app.date).toLocaleDateString()} - {app.slotTime}
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Your Rating
              </label>
              <div className="flex">
                {[...Array(5)].map((_, index) => {
                  const ratingValue = index + 1;
                  return (
                    <label key={index} className="cursor-pointer mr-2">
                      <input
                        type="radio"
                        name="rating"
                        className="hidden"
                        value={ratingValue}
                        onClick={() => setRating(ratingValue)}
                      />
                      <FaStar
                        size={30}
                        className="transition-colors duration-200"
                        color={ratingValue <= (hover || rating) ? "#FFD700" : "#e4e5e9"}
                        onMouseEnter={() => setHover(ratingValue)}
                        onMouseLeave={() => setHover(null)}
                      />
                    </label>
                  );
                })}
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Your Experience
              </label>
              <textarea
                className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-primary dark:focus:border-blue-400 focus:ring-1 focus:ring-primary dark:focus:ring-blue-400 transition-all resize-none placeholder-gray-500 dark:placeholder-gray-400"
                rows="4"
                placeholder="Share your experience with the doctor..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              ></textarea>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg text-white font-medium ${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-blue-600'
              } transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary`}
            >
              {loading ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DoctorReviewForm;
