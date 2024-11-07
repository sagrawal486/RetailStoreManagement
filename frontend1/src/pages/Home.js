import React, { useState } from 'react';
import FileUpload from '../components/FileUpload';
import SearchBar from '../components/SearchBar';
import PricingTable from '../components/PricingTable';
import '../styles/App.css';

function Home() {
  const [pricingData, setPricingData] = useState([]);

  const handleDataUpdate = (data) => {
    setPricingData(data);
  };

  return (
    <div className="home">
      <h1>Pricing Feed Manager</h1>
      <FileUpload onFileUpload={handleDataUpdate} />
      <SearchBar data={pricingData} onSearch={setPricingData} />
      <PricingTable data={pricingData} onDataChange={setPricingData} />
    </div>
  );
}

export default Home;
