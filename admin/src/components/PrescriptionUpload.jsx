import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const PrescriptionUpload = ({ appointmentId, onUploaded }) => {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return toast.error('Please select a file');
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('appointmentId', appointmentId);
      formData.append('description', description);
      const token = localStorage.getItem('dToken');
      const { data } = await axios.post(
        import.meta.env.VITE_BACKEND_URL + '/api/prescriptions/upload',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data', dToken: token } }
      );
      if (data.success) {
        toast.success('Prescription uploaded');
        setFile(null);
        setDescription('');
        if (onUploaded) onUploaded();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleUpload} className="flex flex-col gap-2 mt-2">
      <input type="file" accept="application/pdf,image/*" onChange={handleFileChange} />
      <input
        type="text"
        placeholder="Description (optional)"
        value={description}
        onChange={e => setDescription(e.target.value)}
        className="border rounded px-2 py-1"
      />
      <button type="submit" disabled={isUploading} className="bg-indigo-600 text-white px-4 py-1 rounded">
        {isUploading ? 'Uploading...' : 'Upload Prescription'}
      </button>
    </form>
  );
};

export default PrescriptionUpload;
