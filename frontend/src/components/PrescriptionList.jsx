import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PrescriptionList = ({ appointmentId }) => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          import.meta.env.VITE_BACKEND_URL + `/api/prescriptions/appointment/${appointmentId}`,
          { headers: { 'Cache-Control': 'no-cache', Pragma: 'no-cache', Expires: '0' } }
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
  if (!prescriptions.length) return (
    <div className="mt-2">
      <h4 className="font-semibold mb-1">Prescriptions</h4>
      <div>No prescriptions uploaded yet.</div>
    </div>
  );

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
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PrescriptionList;
