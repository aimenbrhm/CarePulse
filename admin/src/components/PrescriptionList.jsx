import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PrescriptionList = ({ appointmentId }) => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const dToken = localStorage.getItem('dToken');

  useEffect(() => {
    const fetchPrescriptions = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          import.meta.env.VITE_BACKEND_URL + `/api/prescriptions/appointment/${appointmentId}`
        );
        if (data.success) setPrescriptions(data.prescriptions);
      } catch (error) {
        setPrescriptions([]);
      } finally {
        setLoading(false);
      }
    };
    if (appointmentId) fetchPrescriptions();
  }, [appointmentId]);

  if (loading) return <div>Loading prescriptions...</div>;
  if (!prescriptions.length) return <div>No prescriptions uploaded yet.</div>;

  const handleDelete = async (prescriptionId) => {
    if (!window.confirm('Are you sure you want to delete this prescription?')) return;
    try {
      const res = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/prescriptions/delete/${prescriptionId}`, {
        headers: { dtoken: dToken }
      });
      if (res.data.success) {
        setPrescriptions(prescriptions.filter(p => p._id !== prescriptionId));
      } else {
        alert('Failed to delete prescription: ' + res.data.message);
      }
    } catch (err) {
      alert('Failed to delete prescription: ' + (err.response?.data?.message || err.message));
    }
  };


  const refreshPrescriptions = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        import.meta.env.VITE_BACKEND_URL + `/api/prescriptions/appointment/${appointmentId}`
      );
      if (data.success) setPrescriptions(data.prescriptions);
    } catch {
      setPrescriptions([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-2">
      <h4 className="font-semibold mb-1">Prescriptions</h4>
      <ul className="space-y-2">
        {prescriptions.map((presc) => (
          <li key={presc._id} className="border rounded p-2 flex flex-col gap-1">
            <span className="text-gray-700">{presc.description || 'No description'}</span>
            <a
              href={
                presc.fileUrl.startsWith('http')
                  ? presc.fileUrl
                  : `${import.meta.env.VITE_BACKEND_URL.replace(/\/api.*/, '')}${presc.fileUrl.startsWith('/') ? presc.fileUrl : '/' + presc.fileUrl}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 underline"
            >
              Download/View
            </a>
            <span className="text-xs text-gray-500">{new Date(presc.createdAt).toLocaleString()}</span>
             {dToken && (
              <div className="flex gap-2 mt-2">
                <button
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
                  onClick={() => handleDelete(presc._id)}
                >Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PrescriptionList;
