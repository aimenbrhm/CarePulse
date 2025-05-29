import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import DoctorReviewForm from '../components/DoctorReviewForm';
import DoctorReviews from '../components/DoctorReviews';

const SPECIALITIES = [
  'Generalist',
  'Gynecologist',
  'Dermatologist',
  'Pediatricians',
  'Neurologist',
  'Gastroenterologist'
];

const Doctors = () => {
  const { speciality } = useParams()
  const [filterDoc, setFilterDoc] = useState([])
  const [showFilter, setShowFilter] = useState(false)
  const [search, setSearch] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [sortExperience, setSortExperience] = useState("");
  const [doctorRatings, setDoctorRatings] = useState({});

  const navigate = useNavigate()
  const { doctors, backendUrl } = useContext(AppContext)

  // Fetch reviews for all doctors and compute average rating and review count
  useEffect(() => {
    const fetchRatings = async () => {
      const ratings = {};
      for (const doc of doctors) {
        try {
          const response = await fetch(`${backendUrl}/api/doctor-reviews/${doc._id}`);
          const data = await response.json();
          if (data.success && Array.isArray(data.reviews)) {
            const reviews = data.reviews;
            const avg = reviews.length > 0 ? (reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / reviews.length) : 0;
            ratings[doc._id] = { avgRating: avg, reviewCount: reviews.length };
          } else {
            ratings[doc._id] = { avgRating: 0, reviewCount: 0 };
          }
        } catch (e) {
          ratings[doc._id] = { avgRating: 0, reviewCount: 0 };
        }
      }
      setDoctorRatings(ratings);
    };
    if (doctors && doctors.length > 0) fetchRatings();
  }, [doctors, backendUrl]);

  const applyFilter = () => {
    let filtered = doctors;
    if (speciality) {
      // For backwards compatibility, treat both 'General physician' and 'Generalist' as equivalent
      filtered = filtered.filter(doc => {
        if (speciality === 'Generalist') {
          return doc.speciality === 'Generalist' || doc.speciality === 'General physician';
        }
        return doc.speciality === speciality;
      });
    }
    if (search.trim() !== "") {
      filtered = filtered.filter(doc => doc.name.toLowerCase().includes(search.toLowerCase()));
    }
    if (minRating > 0) {
      filtered = filtered.filter(doc => {
        const rating = doctorRatings[doc._id]?.avgRating || 0;
        return rating >= minRating;
      });
    }
    // Sort by experience if selected
    if (sortExperience === "desc") {
      filtered = [...filtered].sort((a, b) => {
        const expA = a.experience ? parseInt(a.experience) : 0;
        const expB = b.experience ? parseInt(b.experience) : 0;
        return expB - expA;
      });
    } else if (sortExperience === "asc") {
      filtered = [...filtered].sort((a, b) => {
        const expA = a.experience ? parseInt(a.experience) : 0;
        const expB = b.experience ? parseInt(b.experience) : 0;
        return expA - expB;
      });
    }

    setFilterDoc(filtered);
  }
  useEffect(() => {
    applyFilter()
  }, [doctors, speciality, search, minRating, sortExperience])

  return (
    <div className="dark:bg-gray-900 min-h-screen px-2 sm:px-4 md:px-8">
      <p className='text-gray-600 dark:text-white font-medium text-base mb-2'>Browse through the doctors specialist.</p>
      {/* Mobile filter button under the text */}
      <div className="sm:hidden mb-4">
        <button className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#5f6FFF] to-[#8a77ff] text-white font-medium shadow-md hover:shadow-lg transition-all" onClick={() => setShowFilter(true)}>
          Filters
        </button>
      </div>
      {/* Modal for mobile filters */}
      {showFilter && (
        <div className="fixed inset-0 z-50 flex items-end sm:hidden">
          <div className="absolute inset-0 bg-black bg-opacity-40" onClick={() => setShowFilter(false)}></div>
          <div className="relative w-full bg-white dark:bg-gray-900 rounded-t-2xl p-6 pb-8 max-h-[75vh] overflow-y-auto animate-slide-up">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Filter by Speciality</h3>
              <button className="text-gray-500 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white text-2xl" onClick={() => setShowFilter(false)}>&times;</button>
            </div>
            <div className="flex flex-col gap-3">
              {SPECIALITIES.map(spec => (
                <button
                  key={spec}
                  onClick={() => {
                    setShowFilter(false);
                    if (speciality === spec) {
                      navigate('/doctors');
                    } else {
                      navigate(`/doctors/${spec}`);
                    }
                  }}
                  className={`w-full py-3 px-4 rounded-xl font-medium shadow-md transition-all mb-2
                    ${speciality === spec
                      ? 'bg-gradient-to-r from-[#5f6FFF] to-[#8a77ff] text-white hover:shadow-lg ring-2 ring-[#5f6FFF]'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-700 hover:bg-[#e6e8ff] dark:hover:bg-[#23243a]'}
                  `}
                >
                  {spec}
                </button>
              ))}
              {/* Rating Filter - Mobile */}
              <select
                id="doctor-rating-filter-mobile"
                value={minRating}
                onChange={e => setMinRating(Number(e.target.value))}
                className="w-full py-3 px-4 rounded-xl font-medium shadow-md transition-all mb-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
              >
                <option value={0}>All Ratings</option>
                <option value={5}>5 Stars</option>
                <option value={4}>4 Stars</option>
                <option value={3}>3 Stars</option>
                <option value={2}>2 Stars</option>
                <option value={1}>1 Star</option>
              </select>
              {/* Experience Sort - Mobile */}
              <select
                id="doctor-experience-sort-mobile"
                value={sortExperience}
                onChange={e => setSortExperience(e.target.value)}
                className="w-full py-3 px-4 rounded-xl font-medium shadow-md transition-all mb-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 z-50"
                style={{ position: 'relative', zIndex: 50 }}
              >
                <option value="">Sort by Experience</option>
                <option value="desc">Highest to Lowest</option>
                <option value="asc">Lowest to Highest</option>
              </select>

            </div>
          </div>
        </div>
      )}
      {/* Desktop filter list (now horizontal under the phrase) */}
      <div className="hidden sm:flex flex-row gap-4 text-sm text-gray-600 dark:text-white w-full mb-6 items-center justify-between">
        <div className="flex flex-row gap-4 items-center">
          {SPECIALITIES.map(spec => (
            <p
              key={spec}
              onClick={() => speciality === spec ? navigate('/doctors') : navigate(`/doctors/${spec}`)}
              className={`px-4 py-2 border border-gray-300 dark:border-gray-700 rounded transition-all cursor-pointer ${speciality === spec ? 'bg-indigo-100 text-black dark:bg-[#5f6FFF] dark:text-white' : 'dark:bg-gray-800 dark:text-white'}`}
            >
              {spec}
            </p>
          ))}
          {/* Rating Filter */}
          <select
            id="doctor-rating-filter-desktop"
            value={minRating}
            onChange={e => setMinRating(Number(e.target.value))}
            className="ml-4 px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none"
            style={{ minWidth: 140 }}
          >
            <option value={0}>All Ratings</option>
            <option value={5}>5 Stars+</option>
            <option value={4}>4 Stars+</option>
            <option value={3}>3 Stars+</option>
            <option value={2}>2 Stars+</option>
            <option value={1}>1 Star+</option>
          </select>
          {/* Experience Sort */}
          <select
            id="doctor-experience-sort-desktop"
            value={sortExperience}
            onChange={e => setSortExperience(e.target.value)}
            className="ml-2 px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none"
            style={{ minWidth: 170 }}
          >
            <option value="">Sort by Experience</option>
            <option value="desc">Highest to Lowest</option>
            <option value="asc">Lowest to Highest</option>
          </select>
        </div>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by doctor name..."
          className="ml-4 px-4 py-2 rounded border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white"
          style={{ maxWidth: 260 }}
        />
      </div>

      <div className='flex-1'>
        <div className='grid grid-cols-auto gap-4 gap-y-6'>
          {
            filterDoc.map((item, index) => (
              <div onClick={() => navigate(`/appointment/${item._id}`)} className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500' key={index}>
                <img className='bg-blue-50' src={item.image} alt="" />
                <div className='p-4'>
                  <div className={`flex items-center gap-2 text-sm text-center ${item.available ? 'text-green-500' : 'text-gray-500'}`}>
                    <p className={`w-2 h-2 ${item.available ? 'bg-green-500' : 'bg-gray-500'}  rounded-full`}></p><p>{item.available ? 'Available' : 'Not Available'}</p>
                  </div>
                  <p className='text-gray-900 dark:text-white text-lg font-medium '>{item.name}</p>
                  <div className='flex items-center gap-1 mt-1'>
                    {[1,2,3,4,5].map(i => (
                      <span key={i} style={{color: (doctorRatings[item._id]?.avgRating || 0) >= i ? '#FFD700' : '#E5E7EB', fontSize: '1.1em'}}>&#9733;</span>
                    ))}
                    <span className='text-xs text-gray-500 ml-1'>
                      {(doctorRatings[item._id]?.avgRating || 0).toFixed(1)}
                      {` (${doctorRatings[item._id]?.reviewCount || 0})`}
                    </span>
                  </div>
                  <p className='text-gray-600 dark:text-white text-sm'>{item.speciality}</p>
                </div>

              </div>
            ))
          }
        </div>
      </div>
      <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.3s cubic-bezier(.4,0,.2,1);
        }
      `}</style>
    </div>
  )
}

export default Doctors
