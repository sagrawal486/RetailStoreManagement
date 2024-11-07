import React from 'react';
import { uploadPricingData } from '../api/pricingApi';

function FileUpload({ onFileUpload }) {
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const response = await uploadPricingData(file);
      onFileUpload(response.data);
      alert(response.message);
    } catch (error) {
      alert('File upload failed');
    }
  };

  return (
    <div className="file-upload">
      <input type="file" accept=".csv" onChange={handleFileChange} />
    </div>
  );
}

export default FileUpload;
