import React, { useContext, useEffect, useState } from 'react';
import AppointmentQRCode from '../components/AppointmentQRCode';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import RelatedDoctors from '../compenents/RelatedDoctors';
import DoctorReviews from '../components/DoctorReviews';
import DoctorReviewForm from '../components/DoctorReviewForm';
import { toast } from 'react-toastify';
import axios from 'axios';
import { 
  FiArrowLeft, 
  FiClock, 
  FiDollarSign, 
  FiInfo, 
  FiCheckCircle,
  FiCalendar,
  FiMapPin,
  FiStar
} from 'react-icons/fi';
import { motion } from 'framer-motion';

const Appointment = () => {
  const { docId } = useParams();
  const { doctors, currencySymbol, backendUrl, token, getDoctorsData, userData } = useContext(AppContext);
  const navigate = useNavigate();
  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState('');
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [qrData, setQrData] = useState(null);
  const [reviewRefreshTrigger, setReviewRefreshTrigger] = useState(0);

  const formatDay = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const fetchDocInfo = async () => {
    try {
      const docInfo = doctors.find(doc => doc._id === docId);
      setDocInfo(docInfo);
    } catch (error) {
      toast.error('Failed to load doctor information');
    }
  };

  const getAvailableSlots = async () => {
    if (!docInfo) return;
    
    setLoading(true);
    
    try {
      const today = new Date();
      const slots = [];

      for (let i = 0; i < 7; i++) {
        const currentDate = new Date(today);
        currentDate.setDate(today.getDate() + i);

        const endTime = new Date(currentDate);
        endTime.setHours(21, 0, 0, 0);

        // Set start time based on current time for today
        if (i === 0) {
          const now = new Date();
          if (now.getHours() >= 21) continue; // Skip today if it's after 9 PM
          
          currentDate.setHours(Math.max(10, now.getHours() + 1));
          currentDate.setMinutes(now.getMinutes() > 30 ? 0 : 30);
        } else {
          currentDate.setHours(10);
          currentDate.setMinutes(0);
        }

        const timeSlots = [];
        while (currentDate < endTime) {
          const formattedTime = currentDate.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true
          }).toLowerCase();

          const day = currentDate.getDate();
          const month = currentDate.getMonth() + 1;
          const year = currentDate.getFullYear();
          const slotDate = `${day}_${month}_${year}`;
          
          const isSlotAvailable = !(docInfo.slots_booked[slotDate] && 
            docInfo.slots_booked[slotDate].includes(formattedTime));

          if (isSlotAvailable) {
            timeSlots.push({
              datetime: new Date(currentDate),
              time: formattedTime
            });
          }

          currentDate.setMinutes(currentDate.getMinutes() + 30);
        }

        if (timeSlots.length > 0) {
          slots.push(timeSlots);
        }
      }

      setDocSlots(slots);
    } catch (error) {
      toast.error('Failed to load available slots');
    } finally {
      setLoading(false);
    }
  };

  const bookAppointment = async () => {
    if (!token) {
      toast.warn('Please login to book an appointment');
      return navigate('/login');
    }
    
    if (!slotTime) {
      toast.warn('Please select a time slot');
      return;
    }

    setBooking(true);
    
    try {
      const date = docSlots[slotIndex][0].datetime;
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const slotDate = `${day}_${month}_${year}`;

      const { data } = await axios.post(
        `${backendUrl}/api/user/book-appointment`,
        { docId, slotDate, slotTime },
        { headers: { token } }
      );
      
      if (data.success) {
        toast.success('Appointment booked successfully!');
        try {
          // Prepare QR code data (appointment fields)
          let qrPayload = {
            // Patient info
            patient: (userData && userData.name) || data.user?.name || '',
            patientImage: (userData && userData.image) || data.user?.image || '',
            dob: (userData && userData.dob) || data.user?.dob || '',
            gender: (userData && userData.gender) || data.user?.gender || '',
            // Doctor info
            doctor: docInfo.name,
            doctorImage: docInfo.image || '',
            speciality: docInfo.speciality,
            appointmentId: `${docId}_${docSlots[slotIndex][0].datetime.toISOString().slice(0,10)}_${slotTime}_${(userData && userData._id) || ''}`,
            // Appointment details
            date: docSlots[slotIndex][0].datetime.toISOString().slice(0,10),
            time: slotTime,
            fees: docInfo.fees
          };

          // Fetch medical record and merge into QR payload
          try {
            const medRes = await axios.get(`${backendUrl}/api/user/medical-record`, { headers: { token } });
            if (medRes.data.success && medRes.data.record) {
              const med = medRes.data.record;
              // Only add non-empty fields to avoid QR bloat
              const medFields = [
                'firstName','lastName','address1','address2','previousIllnesses','familyHistory','currentMedications','previousMedications','allergies','surgeries','bloodType','height','weight','emergencyContact','chronicDiseases','immunizations','notes'
              ];
              medFields.forEach(field => {
                if (med[field] && String(med[field]).trim() !== '') {
                  qrPayload[field] = med[field];
                }
              });
            }
          } catch (err) {
            // If medical record fetch fails, continue with appointment data only
            console.error('Failed to fetch medical record for QR:', err);
          }

          setQrData(qrPayload);
          setShowQR(true);
          getDoctorsData();
          // Optionally, do not navigate immediately so user can scan QR
          // navigate('/my-appointments');
        } catch (err) {
          // Log errors after booking, but don't show error toast
          console.error('Error after booking success:', err);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Booking error:', error);
      toast.error(error.response?.data?.message || 'Failed to book appointment');
    } finally {
      setBooking(false);
    }
  };

  useEffect(() => {
    fetchDocInfo();
  }, [doctors, docId]);

  useEffect(() => {
    if (docInfo) {
      getAvailableSlots();
    }
  }, [docInfo]);

  if (!docInfo) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-primary mb-8 transition-colors"
      >
        <FiArrowLeft className="mr-2" />
        <span>Back to results</span>
      </motion.button>

      {/* Doctor Profile Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mb-8 dark:text-white"
      >
        <div className="md:flex">
          {/* Doctor Image */}
          <div className="md:w-1/3 lg:w-1/4 p-6 flex justify-center bg-gray-50 dark:bg-gray-900">
            <div className="relative">
              <img
                className="w-48 h-48 md:w-56 md:h-56 rounded-full object-cover border-4 border-white shadow-md"
                src={docInfo.image}
                alt={docInfo.name}
              />
              <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-full shadow-lg">
                <FiCheckCircle className="text-emerald-500 text-xl" />
              </div>
            </div>
          </div>

          {/* Doctor Info */}
          <div className="md:w-2/3 lg:w-3/4 p-6 md:p-8">
            <div className="flex flex-col h-full">
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                      {docInfo.name}
                      <span className="ml-2 text-blue-500">
                        <FiCheckCircle />
                      </span>
                    </h1>
                    <p className="text-gray-600 dark:text-gray-200 mt-1">{docInfo.degree}</p>
                    <p className="text-primary dark:text-white font-medium">{docInfo.speciality}</p>
                  </div>
                  
                  <div className="flex items-center bg-blue-50 dark:bg-[#23243a] px-3 py-1 rounded-full mt-2 sm:mt-0">
                    <FiMapPin className="mr-2 text-gray-400 dark:text-white" />
                    <span>5 km away</span>
                  </div>
                </div>
              </div>

              {/* About Section */}
              <div className="mt-6 border-t pt-6">
                <h2 className="flex items-center text-lg font-semibold text-gray-800 dark:text-white mb-3">
                  <FiInfo className="mr-2 text-primary" />
                  About Dr. {docInfo.name.split(' ')[0]}
                </h2>
                <p className="text-gray-600 dark:text-gray-200 leading-relaxed">{docInfo.about}</p>
              </div>
              
              {/* Doctor Reviews Section */}
              <div className="mt-6 border-t pt-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white mr-3">
                      Reviews
                    </h2>
                    <div id="doctor-rating-summary" className="flex items-center">
                      {/* Rating summary will be loaded dynamically */}
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => {
                      const reviewFormSection = document.getElementById('review-form-section');
                      if (reviewFormSection) {
                        reviewFormSection.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="flex items-center bg-primary text-white py-1 px-3 text-sm rounded-md hover:bg-blue-600 transition-colors duration-300"
                  >
                    View Reviews
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Booking Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 dark:text-white"
        >
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
            <FiCalendar className="mr-2 text-primary" />
            Select Date & Time
          </h2>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : docSlots.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">No available slots in the next 7 days</div>
              <button 
                onClick={getAvailableSlots}
                className="text-primary hover:text-primary-dark font-medium"
              >
                Refresh availability
              </button>
            </div>
          ) : (
            <>
              {/* Date Selector */}
              <div className="mb-8">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                  Available Dates
                </h3>
                <div className="flex space-x-3 overflow-x-auto pb-4 -mx-1 px-1">
                  {docSlots.map((item, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setSlotIndex(index);
                        setSlotTime('');
                      }}
                      className={`flex flex-col items-center justify-center min-w-20 py-3 px-4 rounded-xl transition-all ${
                        slotIndex === index
                          ? 'bg-[#5f6FFF] text-white shadow-md'
                          : 'bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-[#3c429e] text-gray-700 dark:text-white'
                      }`}
                    >
                      <span className="text-sm font-medium">
                        {formatDay(item[0].datetime)}
                      </span>
                      <span className="text-lg font-bold">
                        {item[0].datetime.getDate()}
                      </span>
                      <span className="text-xs opacity-80">
                        {item[0].datetime.toLocaleString('default', { month: 'short' })}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Time Slot Selector */}
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                  Available Time Slots
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {docSlots[slotIndex].map((item, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.03 }}
                      onClick={() => setSlotTime(item.time)}
                      className={`py-3 px-4 rounded-xl border transition-all flex items-center justify-center ${
                        item.time === slotTime
                          ? 'bg-[#5f6FFF] border-[#5f6FFF] text-white shadow-md'
                          : 'border-gray-200 dark:border-gray-700 hover:border-[#5f6FFF] hover:text-[#5f6FFF] dark:hover:bg-[#3c429e] text-gray-700 dark:text-white'
                      }`}
                    >
                      <FiClock className="mr-2" />
                      {item.time}
                    </motion.button>
                  ))}
                </div>
              </div>
            </>
          )}
        </motion.div>

        {/* Booking Summary */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 h-fit sticky top-6 dark:text-white"
        >
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Appointment Summary</h2>

          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-200">Consultation Fee:</span>
              <span className="font-medium text-gray-900 dark:text-white">{currencySymbol}{docInfo.fees}</span>
            </div>

            {slotTime && (
              <>
                <div className="py-4 border-b border-gray-100 dark:border-gray-700 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-200">Date:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatDate(docSlots[slotIndex][0].datetime)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-200">Time:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{slotTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-200">Duration:</span>
                    <span className="font-medium text-gray-900 dark:text-white">30 minutes</span>
                  </div>
                </div>

                <div className="pt-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={bookAppointment}
                    disabled={booking}
                    className={`w-full py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center ${
                      booking 
                        ? 'bg-[#5f6FFF]/80 cursor-not-allowed' 
                        : 'bg-[#5f6FFF] hover:bg-[#3c429e] cursor-pointer'
                    } text-white shadow-md`}
                  >
                    {booking ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      'Confirm Appointment'
                    )}
                  </motion.button>
                </div>
              </>
            )}

            {!slotTime && (
              <div className="text-center py-6 text-gray-500 dark:text-gray-200 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <FiClock className="mx-auto text-2xl mb-2 text-gray-400 dark:text-gray-200" />
                <p>Please select a time slot</p>
              </div>
            )}

            <div className="text-xs text-gray-400 dark:text-gray-300 mt-4">
              <p className="text-center">By booking, you agree to our Terms of Service</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* QR Code Modal */}
      {showQR && qrData && (
        <div style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.45)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{background:'#fff',padding:32,borderRadius:16,maxWidth:340,width:'90vw',textAlign:'center',position:'relative'}}>
            <button onClick={()=>setShowQR(false)} style={{position:'absolute',top:12,right:16,fontSize:20,border:'none',background:'none',cursor:'pointer',color:'#111'}}>×</button>
            <h2 style={{marginBottom:16,fontWeight:'bold',color:'#111'}}>Appointment QR Code</h2>
            <AppointmentQRCode qrData={qrData} value={qrData?.qrString} downloadName={`appointment-qr-${qrData?.date||''}.png`} />
            <button
              style={{marginTop:12,padding:'8px 18px',fontWeight:'bold',background:'#5f6FFF',color:'#fff',border:'none',borderRadius:8,cursor:'pointer'}}
              onClick={()=>{
                const canvas = document.querySelector('#appointment-qr-canvas');
                if (canvas) {
                  const url = canvas.toDataURL('image/png');
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = `appointment-qr-${qrData?.date||''}.png`;
                  link.click();
                } else {
                  // fallback for svg
                  const svg = document.querySelector('#appointment-qr-svg');
                  if (svg) {
                    const serializer = new XMLSerializer();
                    const source = serializer.serializeToString(svg);
                    const image = new Image();
                    image.onload = function() {
                      const canvas = document.createElement('canvas');
                      canvas.width = 192;
                      canvas.height = 192;
                      const ctx = canvas.getContext('2d');
                      ctx.fillStyle = '#fff';
                      ctx.fillRect(0,0,canvas.width,canvas.height);
                      ctx.drawImage(image, 0, 0);
                      const url = canvas.toDataURL('image/png');
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = `appointment-qr-${qrData?.date||''}.png`;
                      link.click();
                    };
                    image.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(source)));
                  }
                }
              }}
            >Download QR Code</button>
            <div style={{marginTop:16,fontSize:14,color:'#333'}}>Show this code at the clinic to check in or download it to your device.</div>
          </div>
        </div>
      )}

      
      {/* Review Form and Reviews Section */}
      <motion.div 
        id="review-form-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6"
      >
        {token && (
          <div className="mb-8 border-b pb-8 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">
              Write Your Review
            </h2>
            
            <DoctorReviewForm 
              doctorId={docId} 
              onReviewSubmitted={() => {
                // Increment the trigger to refresh reviews without page reload
                setReviewRefreshTrigger(prev => prev + 1);
                // No need to reload the page
              }} 
            />
          </div>
        )}
        
        {/* Reviews List */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">
            All Reviews
          </h2>
          <DoctorReviews doctorId={docId} refreshTrigger={reviewRefreshTrigger} />
        </div>
      </motion.div>

      {/* Related Doctors */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-16"
      >
        <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
      </motion.div>
    </div>
  );
};

export default Appointment;