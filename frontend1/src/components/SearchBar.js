import React, { useState } from 'react';
import axios from 'axios';

function SearchBar({ onSearch }) {
  const [storeId, setStoreId] = useState('');
  const [sku, setSku] = useState('');
  const [productName, setProductName] = useState('');

  const handleSearch = async () => {
    try {
      const response = await axios.get('/api/pricing-data', {
        params: {
          store_id: storeId,
          sku: sku,
          product_name: productName,
        },
      });
      onSearch(response.data); 
    } catch (error) {
      console.error("Error fetching search results:", error);
      onSearch([]); 
    }
  };

  return (
    <div className="search-bar">
      <input 
        type="text" 
        placeholder="Search by Store ID" 
        value={storeId}
        onChange={(e) => setStoreId(e.target.value)}
      />
      <input 
        type="text" 
        placeholder="Search by SKU" 
        value={sku}
        onChange={(e) => setSku(e.target.value)}
      />
      <input 
        type="text" 
        placeholder="Search by Product Name" 
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
}

export default SearchBar;
