import React from 'react';
import QRCode from 'react-qr-code';

const MAX_QR_LENGTH = 23648; // QR code library limit

const AppointmentQRCode = ({ value, qrData }) => {
  // Restore info-rich QR, but optimize for size
  const formatQRValue = () => {
    if (qrData && typeof qrData === 'object') {
      // Only allow short, non-image, non-long fields
      // Define essential fields for each section
      const patientFields = ['patient', 'dob', 'gender'];
      const medRecordFields = [
        'firstName','lastName','address1','address2','previousIllnesses','familyHistory',
        'currentMedications','previousMedications','allergies','surgeries','bloodType','height','weight','emergencyContact','chronicDiseases','immunizations'
      ];
      const notesField = ['notes']; // We'll truncate notes
      const doctorFields = ['doctor','speciality','appointmentId'];
      const appointmentFields = ['date','time','fees'];

      function section(title, obj, fields) {
        let result = `--- ${title} ---\n`;
        fields.forEach(key => {
          if (obj[key] && String(obj[key]).trim() !== '') {
            let val = String(obj[key]);
            // Truncate long fields
            if (key === 'notes' && val.length > 100) val = val.slice(0, 100) + '...';
            result += `${key.replace(/([A-Z])/g, ' $1').replace(/^./, c=>c.toUpperCase())}: ${val}\n`;
          }
        });
        return result + '\n';
      }

      let qrString = '';
      qrString += section('Patient Info', qrData, patientFields);
      qrString += section('Medical Record', qrData, medRecordFields);
      qrString += section('Notes', qrData, notesField);
      qrString += section('Doctor Info', qrData, doctorFields);
      qrString += section('Appointment Details', qrData, appointmentFields);
      return qrString;
    }
    // fallback: just show ID
    return typeof value === 'string' ? value : value?.id || value?.appointmentId || '';
  };

  const qrValue = formatQRValue();

  if (!qrValue) return null;
  if (qrValue.length > MAX_QR_LENGTH) {
    return (
      <div style={{ color: 'red', textAlign: 'center', margin: '2rem 0' }}>
        Appointment QR code is too large to generate.<br />
        Please contact support or try again with a different account.
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'center', margin: '2rem 0' }}>
      <QRCode
        value={qrValue}
        size={192}
        id="appointment-qr-svg"
        style={{ background: '#fff', padding: 8 }}
      />
      <div style={{ marginTop: 8, fontSize: 12, color: '#888' }}>
        Scan this QR code at the clinic
      </div>
    </div>
  );
};

export default AppointmentQRCode;