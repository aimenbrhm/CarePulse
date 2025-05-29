import React, { useState } from 'react';
import axios from 'axios';

const PrescriptionEditModal = ({ open, onClose, prescription, onUpdated }) => {
  const [description, setDescription] = useState(prescription.description || '');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('description', description);
      if (file) formData.append('file', file);
      const { data } = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/prescriptions/update/${prescription._id}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${localStorage.getItem('dToken')}` } }
      );
      if (data.success) {
        onUpdated();
        onClose();
      } else {
        setError(data.message || 'Failed to update');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating prescription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">Edit Prescription</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="font-medium">Description
            <input
              className="w-full mt-1 p-2 border rounded"
              value={description}
              onChange={e => setDescription(e.target.value)}
              disabled={loading}
            />
          </label>
          <label className="font-medium">File (optional, PDF/Image)
            <input
              type="file"
              className="w-full mt-1"
              accept=".pdf,image/*"
              onChange={e => setFile(e.target.files[0])}
              disabled={loading}
            />
          </label>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded" disabled={loading}>Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PrescriptionEditModal;
