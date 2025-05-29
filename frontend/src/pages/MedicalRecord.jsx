import React, { useContext, useEffect, useState } from 'react';
import BloodTypeDropdown from './BloodTypeDropdown';
import GenderDropdown from './GenderDropdown';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import SectionList from './SectionList';
import { FaStethoscope, FaUserMd, FaPills, FaNotesMedical, FaAllergies, FaSyringe, FaRegStickyNote } from 'react-icons/fa';

const MedicalRecord = () => {
  const { backendUrl, token, userData } = useContext(AppContext);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    address1: '',
    address2: '',
    previousIllnesses: '',
    familyHistory: '',
    currentMedications: '',
    previousMedications: '',
    allergies: '',
    surgeries: '',
    notes: '',
    bloodType: '',
    height: '',
    weight: '',
    emergencyContact: '',
    chronicDiseases: '',
    immunizations: ''
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(true); // true = editable, false = view only

  // Fetch whenever token becomes available
  useEffect(() => {
    if (!token) return;
    const fetchMedicalRecord = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get(backendUrl + '/api/user/medical-record', { headers: { token } });
        if (res.data.success && res.data.record) {
          setForm({
            firstName: res.data.record.firstName || '',
            lastName: res.data.record.lastName || '',
            dateOfBirth: res.data.record.dateOfBirth ? res.data.record.dateOfBirth.substring(0, 10) : '',
            gender: res.data.record.gender || '',
            address1: res.data.record.address1 || '',
            address2: res.data.record.address2 || '',
            previousIllnesses: res.data.record.previousIllnesses || '',
            familyHistory: res.data.record.familyHistory || '',
            currentMedications: res.data.record.currentMedications || '',
            previousMedications: res.data.record.previousMedications || '',
            allergies: res.data.record.allergies || '',
            surgeries: res.data.record.surgeries || '',
            notes: res.data.record.notes || '',
            bloodType: res.data.record.bloodType || '',
            height: res.data.record.height || '',
            weight: res.data.record.weight || '',
            emergencyContact: res.data.record.emergencyContact || '',
            chronicDiseases: res.data.record.chronicDiseases || '',
            immunizations: res.data.record.immunizations || ''
          });
        }
      } catch (err) {
        setError('Failed to load medical record.');
      } finally {
        setLoading(false);
      }
    };
    fetchMedicalRecord();
  }, [token, backendUrl]);

  // Debug: log form state changes
  useEffect(() => {
    console.log('Form state:', form);
  }, [form]);

  // For updating notes only (the only string field now)
  const handleNotesChange = (e) => {
    setForm(prev => ({ ...prev, notes: e.target.value }));
  };



  // Generic handlers for add, edit, delete for array sections
  const handleAddItem = async (section, item) => {
    try {
      const res = await axios.post(
        backendUrl + '/api/user/medical-record/add-item',
        { section, item },
        { headers: { token } }
      );
      if (res.data.success) setForm(f => ({ ...f, [section]: res.data.record[section] }));
      else setError(res.data.message || 'Failed to add');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add');
    }
  };

  const handleEditItem = async (section, itemIndex, item) => {
    try {
      const res = await axios.post(
        backendUrl + '/api/user/medical-record/update-item',
        { section, itemIndex, item },
        { headers: { token } }
      );
      if (res.data.success) setForm(f => ({ ...f, [section]: res.data.record[section] }));
      else setError(res.data.message || 'Failed to update');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update');
    }
  };

  const handleDeleteItem = async (section, itemIndex) => {
    try {
      const res = await axios.post(
        backendUrl + '/api/user/medical-record/delete-item',
        { section, itemIndex },
        { headers: { token } }
      );
      if (res.data.success) setForm(f => ({ ...f, [section]: res.data.record[section] }));
      else setError(res.data.message || 'Failed to delete');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete');
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);
    try {
      // Ensure all fields are sent, even if empty
      const payload = {
        firstName: form.firstName || '',
        lastName: form.lastName || '',
        dateOfBirth: form.dateOfBirth || '',
        gender: form.gender || '',
        address1: form.address1 || '',
        address2: form.address2 || '',
        previousIllnesses: form.previousIllnesses || '',
        familyHistory: form.familyHistory || '',
        currentMedications: form.currentMedications || '',
        previousMedications: form.previousMedications || '',
        allergies: form.allergies || '',
        surgeries: form.surgeries || '',
        notes: form.notes || '',
        bloodType: form.bloodType || '',
        height: form.height || '',
        weight: form.weight || '',
        emergencyContact: form.emergencyContact || '',
        chronicDiseases: form.chronicDiseases || '',
        immunizations: form.immunizations || ''
      };
      const res = await axios.post(
        backendUrl + '/api/user/medical-record',
        payload,
        { headers: { token } }
      );
      if (res.data.success) {
        setSuccess(true);
        setEditMode(false);
      } else setError(res.data.message || 'Failed to save');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  // Delete record handler
  // Reset (clear) all fields and switch to edit mode
  const handleDeleteRecord = () => {
    setForm({
      previousIllnesses: '',
      familyHistory: '',
      currentMedications: '',
      previousMedications: '',
      allergies: '',
      surgeries: '',
      notes: '',
      bloodType: '',
      height: '',
      weight: '',
      emergencyContact: '',
      chronicDiseases: '',
      immunizations: ''
    });
    setEditMode(true);
    setError('');
    setSuccess(false);
  };



// Floating label section card component
function SectionCard({ icon, color, label, name, value, onChange, placeholder, tooltip, className, readOnly }) {
  return (
    <div className={`relative rounded-2xl shadow-xl p-6 border bg-white/90 dark:bg-gray-900/80 border-gray-200 dark:border-gray-800 transition-all duration-300 ${className || ''}`}>  
      <div className="flex items-center gap-2 mb-2">
        <span className="p-2 rounded-full bg-white/70 dark:bg-gray-800/70 shadow text-xl border border-gray-200 dark:border-gray-700">{icon}</span>
        <span className="font-semibold text-lg text-gray-900 dark:text-gray-100 animate-fadeInUp">{label}</span>
      </div>
      <textarea
        id={name}
        name={name}
        value={typeof value === 'string' ? value : (value !== undefined && value !== null ? String(value) : '')}
        onChange={onChange}
        placeholder={placeholder || ''}
        rows={3}
        readOnly={readOnly}
        className={
          `peer w-full bg-transparent resize-none border-b-2 border-gray-300 focus:border-[#5f6FFF] outline-none text-gray-900 dark:text-gray-100 text-base pt-6 pb-2 placeholder-gray-400 transition-all duration-200 ${readOnly ? 'opacity-60 cursor-not-allowed' : ''}`
        }
      />
      {tooltip && <div className="text-xs text-gray-400 mt-1">{tooltip}</div>}
    </div>
  );
}

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-100 via-purple-100 to-pink-50 dark:from-[#18181b] dark:via-[#23272e] dark:to-[#0f172a] flex flex-col items-center justify-center font-[Inter,Montserrat,ui-sans-serif]">
       <div className="w-full flex justify-center items-center">
        <div className="relative z-10 backdrop-blur-2xl bg-white/80 dark:bg-gray-900/80 border border-gray-200 dark:border-gray-800 rounded-3xl shadow-2xl p-4 md:p-10 max-w-4xl w-full animate-fadeInUp transition-all duration-700">
          <div className='absolute -top-6 left-1/2 -translate-x-1/2 w-24 h-1.5 rounded-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-60' />
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <svg className="animate-spin h-10 w-10 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
  <div className="grid md:grid-cols-2 gap-6 mt-8 mb-8">
    {/* First Name */}
    <div className="relative rounded-2xl shadow-xl p-6 border bg-white/95 dark:bg-gray-800/90 border-gray-100 dark:border-gray-700 transition-all duration-300 group">
      <label htmlFor="firstName" className="block font-semibold text-lg text-gray-900 dark:text-gray-100 mb-2">First Name</label>
      <input
        type="text"
        id="firstName"
        name="firstName"
        value={form.firstName}
        onChange={e => setForm(prev => ({ ...prev, firstName: e.target.value }))}
        placeholder="Enter first name"
        className="peer w-full bg-white/95 dark:bg-gray-800/90 border-b-2 border-gray-300 focus:border-blue-400 dark:focus:border-blue-400 outline-none text-gray-900 dark:text-gray-100 text-base pt-6 pb-2 placeholder-gray-400 transition-all duration-200"
        readOnly={!editMode}
      />
    </div>
    {/* Last Name */}
    <div className="relative rounded-2xl shadow-xl p-6 border bg-white/95 dark:bg-gray-800/90 border-gray-100 dark:border-gray-700 transition-all duration-300 group">
      <label htmlFor="lastName" className="block font-semibold text-lg text-gray-900 dark:text-gray-100 mb-2">Last Name</label>
      <input
        type="text"
        id="lastName"
        name="lastName"
        value={form.lastName}
        onChange={e => setForm(prev => ({ ...prev, lastName: e.target.value }))}
        placeholder="Enter last name"
        className="peer w-full bg-white/95 dark:bg-gray-800/90 border-b-2 border-gray-300 focus:border-blue-400 dark:focus:border-blue-400 outline-none text-gray-900 dark:text-gray-100 text-base pt-6 pb-2 placeholder-gray-400 transition-all duration-200"
        readOnly={!editMode}
      />
    </div>
    {/* Date of Birth */}
    <div className="relative rounded-2xl shadow-xl p-6 border bg-white/95 dark:bg-gray-800/90 border-gray-100 dark:border-gray-700 transition-all duration-300 group">
      <label htmlFor="dateOfBirth" className="block font-semibold text-lg text-gray-900 dark:text-gray-100 mb-2">Date of Birth</label>
      <input
        type="date"
        id="dateOfBirth"
        name="dateOfBirth"
        value={form.dateOfBirth}
        onChange={e => setForm(prev => ({ ...prev, dateOfBirth: e.target.value }))}
        className="peer w-full bg-transparent border-b-2 border-gray-300 focus:border-blue-400 dark:focus:border-blue-400 outline-none text-gray-900 dark:text-gray-100 text-base pt-6 pb-2 transition-all duration-200"
        readOnly={!editMode}
      />
    </div>
    {/* Gender */}
    <div className="relative rounded-2xl shadow-xl p-6 border bg-white/95 dark:bg-gray-800/90 border-gray-100 dark:border-gray-700 transition-all duration-300 group">
      <GenderDropdown
        value={form.gender}
        onChange={val => setForm(prev => ({ ...prev, gender: val }))}
        disabled={!editMode}
      />
    </div>
    {/* Address 1 */}
    <div className="relative rounded-2xl shadow-xl p-6 border bg-white/95 dark:bg-gray-800/90 border-gray-100 dark:border-gray-700 transition-all duration-300 group">
      <label htmlFor="address1" className="block font-semibold text-lg text-gray-900 dark:text-gray-100 mb-2">Address 1</label>
      <input
        type="text"
        id="address1"
        name="address1"
        value={form.address1}
        onChange={e => setForm(prev => ({ ...prev, address1: e.target.value }))}
        placeholder="Street, Building, etc."
        className="peer w-full bg-transparent border-b-2 border-gray-300 focus:border-blue-400 dark:focus:border-blue-400 outline-none text-gray-900 dark:text-gray-100 text-base pt-6 pb-2 placeholder-gray-400 transition-all duration-200"
        readOnly={!editMode}
      />
    </div>
    {/* Address 2 */}
    <div className="relative rounded-2xl shadow-xl p-6 border bg-white/95 dark:bg-gray-800/90 border-gray-100 dark:border-gray-700 transition-all duration-300 group">
      <label htmlFor="address2" className="block font-semibold text-lg text-gray-900 dark:text-gray-100 mb-2">Address 2</label>
      <input
        type="text"
        id="address2"
        name="address2"
        value={form.address2}
        onChange={e => setForm(prev => ({ ...prev, address2: e.target.value }))}
        placeholder="Apartment, Suite, etc. (optional)"
        className="peer w-full bg-transparent border-b-2 border-gray-300 focus:border-blue-400 dark:focus:border-blue-400 outline-none text-gray-900 dark:text-gray-100 text-base pt-6 pb-2 placeholder-gray-400 transition-all duration-200"
        readOnly={!editMode}
      />
    </div>
    {/* Previous Illnesses */}
    <div className="relative rounded-2xl shadow-xl p-6 border bg-white/95 dark:bg-gray-800/90 border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-2xl hover:border-blue-400 dark:hover:border-blue-400 group">
      <label htmlFor="previousIllnesses" className="block font-semibold text-lg text-gray-900 dark:text-gray-100 mb-2">Previous Illnesses</label>
      <textarea
        id="previousIllnesses"
        name="previousIllnesses"
        value={form.previousIllnesses}
        onChange={e => setForm(prev => ({ ...prev, previousIllnesses: e.target.value }))}
        placeholder="e.g. Diabetes, Hypertension"
        rows={2}
        className="peer w-full bg-transparent resize-none border-b-2 border-gray-300 focus:border-blue-400 dark:focus:border-blue-400 outline-none text-gray-900 dark:text-gray-100 text-base pt-6 pb-2 placeholder-gray-400 transition-all duration-200 focus:bg-blue-50/40 dark:focus:bg-blue-900/20 group-hover:bg-blue-50/20 dark:group-hover:bg-blue-900/10"
        readOnly={!editMode}
      />
    </div>
    {/* Family History */}
    <div className="relative rounded-2xl shadow-xl p-6 border bg-white/95 dark:bg-gray-800/90 border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-2xl hover:border-blue-400 dark:hover:border-blue-400 group">
      <label htmlFor="familyHistory" className="block font-semibold text-lg text-gray-900 dark:text-gray-100 mb-2">Family History</label>
      <textarea
        id="familyHistory"
        name="familyHistory"
        value={form.familyHistory}
        onChange={e => setForm(prev => ({ ...prev, familyHistory: e.target.value }))}
        placeholder="e.g. Heart disease, Cancer"
        rows={2}
        className="peer w-full bg-transparent resize-none border-b-2 border-gray-300 focus:border-blue-400 dark:focus:border-blue-400 outline-none text-gray-900 dark:text-gray-100 text-base pt-6 pb-2 placeholder-gray-400 transition-all duration-200 focus:bg-blue-50/40 dark:focus:bg-blue-900/20 group-hover:bg-blue-50/20 dark:group-hover:bg-blue-900/10"
        readOnly={!editMode}
      />
    </div>
    {/* Current Medications */}
    <div className="relative rounded-2xl shadow-xl p-6 border bg-white/95 dark:bg-gray-800/90 border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-2xl hover:border-blue-400 dark:hover:border-blue-400 group">
      <label htmlFor="currentMedications" className="block font-semibold text-lg text-gray-900 dark:text-gray-100 mb-2">Current Medications</label>
      <textarea
        id="currentMedications"
        name="currentMedications"
        value={form.currentMedications}
        onChange={e => setForm(prev => ({ ...prev, currentMedications: e.target.value }))}
        placeholder="e.g. Metformin, Lisinopril"
        rows={2}
        className="peer w-full bg-transparent resize-none border-b-2 border-gray-300 focus:border-blue-400 dark:focus:border-blue-400 outline-none text-gray-900 dark:text-gray-100 text-base pt-6 pb-2 placeholder-gray-400 transition-all duration-200 focus:bg-blue-50/40 dark:focus:bg-blue-900/20 group-hover:bg-blue-50/20 dark:group-hover:bg-blue-900/10"
        readOnly={!editMode}
      />
    </div>
    {/* Previous Medications */}
    <div className="relative rounded-2xl shadow-xl p-6 border bg-white/95 dark:bg-gray-800/90 border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-2xl hover:border-blue-400 dark:hover:border-blue-400 group">
      <label htmlFor="previousMedications" className="block font-semibold text-lg text-gray-900 dark:text-gray-100 mb-2">Previous Medications</label>
      <textarea
        id="previousMedications"
        name="previousMedications"
        value={form.previousMedications}
        onChange={e => setForm(prev => ({ ...prev, previousMedications: e.target.value }))}
        placeholder="e.g. Antibiotics, Steroids"
        rows={2}
        className="peer w-full bg-transparent resize-none border-b-2 border-gray-300 focus:border-blue-400 dark:focus:border-blue-400 outline-none text-gray-900 dark:text-gray-100 text-base pt-6 pb-2 placeholder-gray-400 transition-all duration-200 focus:bg-blue-50/40 dark:focus:bg-blue-900/20 group-hover:bg-blue-50/20 dark:group-hover:bg-blue-900/10"
        readOnly={!editMode}
      />
    </div>
    {/* Allergies */}
    <div className="relative rounded-2xl shadow-xl p-6 border bg-white/95 dark:bg-gray-800/90 border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-2xl hover:border-blue-400 dark:hover:border-blue-400 group">
      <label htmlFor="allergies" className="block font-semibold text-lg text-gray-900 dark:text-gray-100 mb-2">Allergies</label>
      <textarea
        id="allergies"
        name="allergies"
        value={form.allergies}
        onChange={e => setForm(prev => ({ ...prev, allergies: e.target.value }))}
        placeholder="e.g. Penicillin, Peanuts"
        rows={2}
        className="peer w-full bg-transparent resize-none border-b-2 border-gray-300 focus:border-blue-400 dark:focus:border-blue-400 outline-none text-gray-900 dark:text-gray-100 text-base pt-6 pb-2 placeholder-gray-400 transition-all duration-200 focus:bg-blue-50/40 dark:focus:bg-blue-900/20 group-hover:bg-blue-50/20 dark:group-hover:bg-blue-900/10"
        readOnly={!editMode}
      />
    </div>
    {/* Surgeries */}
    <div className="relative rounded-2xl shadow-xl p-6 border bg-white/95 dark:bg-gray-800/90 border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-2xl hover:border-blue-400 dark:hover:border-blue-400 group">
      <label htmlFor="surgeries" className="block font-semibold text-lg text-gray-900 dark:text-gray-100 mb-2">Surgeries</label>
      <textarea
        id="surgeries"
        name="surgeries"
        value={form.surgeries}
        onChange={e => setForm(prev => ({ ...prev, surgeries: e.target.value }))}
        placeholder="e.g. Appendectomy, Tonsillectomy"
        rows={2}
        className="peer w-full bg-transparent resize-none border-b-2 border-gray-300 focus:border-blue-400 dark:focus:border-blue-400 outline-none text-gray-900 dark:text-gray-100 text-base pt-6 pb-2 placeholder-gray-400 transition-all duration-200 focus:bg-blue-50/40 dark:focus:bg-blue-900/20 group-hover:bg-blue-50/20 dark:group-hover:bg-blue-900/10"
        readOnly={!editMode}
      />
    </div>
    {/* Chronic Diseases */}
    <div className="relative rounded-2xl shadow-xl p-6 border bg-white/95 dark:bg-gray-800/90 border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-2xl hover:border-blue-400 dark:hover:border-blue-400 group">
      <label htmlFor="chronicDiseases" className="block font-semibold text-lg text-gray-900 dark:text-gray-100 mb-2">Chronic Diseases</label>
      <textarea
        id="chronicDiseases"
        name="chronicDiseases"
        value={form.chronicDiseases}
        onChange={e => setForm(prev => ({ ...prev, chronicDiseases: e.target.value }))}
        placeholder="e.g. Asthma, Arthritis"
        rows={2}
        className="peer w-full bg-transparent resize-none border-b-2 border-gray-300 focus:border-blue-400 dark:focus:border-blue-400 outline-none text-gray-900 dark:text-gray-100 text-base pt-6 pb-2 placeholder-gray-400 transition-all duration-200 focus:bg-blue-50/40 dark:focus:bg-blue-900/20 group-hover:bg-blue-50/20 dark:group-hover:bg-blue-900/10"
        readOnly={!editMode}
      />
    </div>
    {/* Immunizations */}
    <div className="relative rounded-2xl shadow-xl p-6 border bg-white/95 dark:bg-gray-800/90 border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-2xl hover:border-blue-400 dark:hover:border-blue-400 group">
      <label htmlFor="immunizations" className="block font-semibold text-lg text-gray-900 dark:text-gray-100 mb-2">Immunizations</label>
      <textarea
        id="immunizations"
        name="immunizations"
        value={form.immunizations}
        onChange={e => setForm(prev => ({ ...prev, immunizations: e.target.value }))}
        placeholder="e.g. Tetanus, Hepatitis B"
        rows={2}
        className="peer w-full bg-transparent resize-none border-b-2 border-gray-300 focus:border-blue-400 dark:focus:border-blue-400 outline-none text-gray-900 dark:text-gray-100 text-base pt-6 pb-2 placeholder-gray-400 transition-all duration-200 focus:bg-blue-50/40 dark:focus:bg-blue-900/20 group-hover:bg-blue-50/20 dark:group-hover:bg-blue-900/10"
        readOnly={!editMode}
      />
    </div>

    {/* Blood Type */}
    <div className="relative rounded-2xl shadow-xl p-6 border bg-white/95 dark:bg-gray-800/90 border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-2xl hover:border-blue-400 dark:hover:border-blue-400 group">
      <BloodTypeDropdown
        value={form.bloodType}
        onChange={val => setForm(prev => ({ ...prev, bloodType: val }))}
        disabled={!editMode}
      />
    </div>
    {/* Height */}
    <div className="relative rounded-2xl shadow-xl p-6 border bg-white/95 dark:bg-gray-800/90 border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-2xl hover:border-blue-400 dark:hover:border-blue-400 group">
      <label htmlFor="height" className="block font-semibold text-lg text-gray-900 dark:text-gray-100 mb-2">Height (cm)</label>
      <input
        type="number"
        id="height"
        name="height"
        value={form.height}
        onChange={e => setForm(prev => ({ ...prev, height: e.target.value }))}
        placeholder="e.g. 175"
        className="peer w-full bg-transparent border-b-2 border-gray-300 focus:border-blue-400 dark:focus:border-blue-400 outline-none text-gray-900 dark:text-gray-100 text-base pt-6 pb-2 placeholder-gray-400 transition-all duration-200 focus:bg-blue-50/40 dark:focus:bg-blue-900/20 group-hover:bg-blue-50/20 dark:group-hover:bg-blue-900/10"
        readOnly={!editMode}
      />
    </div>
    {/* Weight */}
    <div className="relative rounded-2xl shadow-xl p-6 border bg-white/95 dark:bg-gray-800/90 border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-2xl hover:border-blue-400 dark:hover:border-blue-400 group">
      <label htmlFor="weight" className="block font-semibold text-lg text-gray-900 dark:text-gray-100 mb-2">Weight (kg)</label>
      <input
        type="number"
        id="weight"
        name="weight"
        value={form.weight}
        onChange={e => setForm(prev => ({ ...prev, weight: e.target.value }))}
        placeholder="e.g. 70"
        className="peer w-full bg-transparent border-b-2 border-gray-300 focus:border-blue-400 dark:focus:border-blue-400 outline-none text-gray-900 dark:text-gray-100 text-base pt-6 pb-2 placeholder-gray-400 transition-all duration-200 focus:bg-blue-50/40 dark:focus:bg-blue-900/20 group-hover:bg-blue-50/20 dark:group-hover:bg-blue-900/10"
        readOnly={!editMode}
      />
    </div>
    {/* Emergency Contact */}
    <div className="relative rounded-2xl shadow-xl p-6 border bg-white/95 dark:bg-gray-800/90 border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-2xl hover:border-blue-400 dark:hover:border-blue-400 group">
      <label htmlFor="emergencyContact" className="block font-semibold text-lg text-gray-900 dark:text-gray-100 mb-2">Emergency Contact</label>
      <input
        type="text"
        id="emergencyContact"
        name="emergencyContact"
        value={form.emergencyContact}
        onChange={e => setForm(prev => ({ ...prev, emergencyContact: e.target.value }))}
        placeholder="e.g. John Doe, +1234567890"
        className="peer w-full bg-transparent border-b-2 border-gray-300 focus:border-blue-400 dark:focus:border-blue-400 outline-none text-gray-900 dark:text-gray-100 text-base pt-6 pb-2 placeholder-gray-400 transition-all duration-200 focus:bg-blue-50/40 dark:focus:bg-blue-900/20 group-hover:bg-blue-50/20 dark:group-hover:bg-blue-900/10"
        readOnly={!editMode}
      />
    </div>
    {/* Notes */}
    <div className="relative rounded-2xl shadow-xl p-6 border bg-white/95 dark:bg-gray-800/90 border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-2xl hover:border-blue-400 dark:hover:border-blue-400 group md:col-span-2">
      <label htmlFor="notes" className="block font-semibold text-lg text-gray-900 dark:text-gray-100 mb-2">Notes</label>
      <textarea
        id="notes"
        name="notes"
        value={form.notes}
        onChange={e => setForm(prev => ({ ...prev, notes: e.target.value }))}
        placeholder="Any additional notes"
        rows={3}
        className="peer w-full bg-transparent resize-none border-b-2 border-gray-300 focus:border-blue-400 dark:focus:border-blue-400 outline-none text-gray-900 dark:text-gray-100 text-base pt-6 pb-2 placeholder-gray-400 transition-all duration-200 focus:bg-blue-50/40 dark:focus:bg-blue-900/20 group-hover:bg-blue-50/20 dark:group-hover:bg-blue-900/10"
        readOnly={!editMode}
      />
    </div>
  </div>
              <span className="block w-20 h-1 mt-2 rounded-full bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-pulse" />
              <div className="text-base md:text-lg text-gray-500 dark:text-gray-400 font-medium text-center max-w-2xl mt-2">Your health, beautifully organized.</div>
              {error && <div className="text-red-500 font-semibold text-center mt-4 animate-fadeIn">{error}</div>}
              {success && <div className="text-green-600 font-semibold text-center mt-4 animate-fadeIn">Record saved successfully!</div>}
              {editMode ? (
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full md:w-auto py-3 px-8 rounded-2xl font-bold shadow-lg transition-all bg-gradient-to-r from-[#5f6FFF] to-[#8a77ff] text-white hover:from-[#6f7fff] hover:to-[#a28dff] focus:outline-none focus:ring-2 focus:ring-[#5f6FFF] focus:ring-offset-2 text-lg tracking-wide"
                >
                  {saving ? 'Saving...' : 'Save Medical Record'}
                </button>
              ) : (
                <div className="flex flex-col md:flex-row gap-4 mt-6">
                  <button
                    type="button"
                    className="w-full md:w-auto py-3 px-8 rounded-2xl font-bold shadow-lg transition-all bg-gradient-to-r from-[#5f6FFF] to-[#8a77ff] text-white hover:from-[#6f7fff] hover:to-[#a28dff] focus:outline-none focus:ring-2 focus:ring-[#5f6FFF] focus:ring-offset-2 text-lg tracking-wide"
                    onClick={() => setEditMode(true)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="w-full md:w-auto py-3 px-8 rounded-xl font-semibold shadow-md transition-all duration-300 bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
                    onClick={handleDeleteRecord}
                    disabled={saving}
                  >
                    {saving ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default MedicalRecord;
