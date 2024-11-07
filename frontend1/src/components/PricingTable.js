import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PricingTable({ data, onDataChange }) {
  const [editableData, setEditableData] = useState([]);

  useEffect(() => {
    setEditableData(data);
  }, [data]);

  const handleEdit = (index, field, value) => {
    const updatedData = [...editableData];
    updatedData[index][field] = field === 'price' ? parseFloat(value) : value;
    setEditableData(updatedData);
  };

  const handleSave = async () => {
    try {
      for (const record of editableData) {
        await axios.put(`/api/pricing-data/${record.id}`, {
          store_id: record.store_id,
          sku: record.sku,
          product_name: record.product_name,
          price: record.price,
          date: record.date,
        });
      }
      onDataChange(editableData); 
      alert("Changes saved successfully!");
    } catch (error) {
      console.error("Error saving changes:", error);
      alert("Failed to save changes.");
    }
  };

  return (
    <div className="pricing-table">
      <table>
        <thead>
          <tr>
            <th>Store ID</th>
            <th>SKU</th>
            <th>Product Name</th>
            <th>Price</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {editableData.map((record, index) => (
            <tr key={record.id}>
              <td>
                <input 
                  type="text" 
                  value={record.store_id} 
                  onChange={(e) => handleEdit(index, 'store_id', e.target.value)}
                />
              </td>
              <td>
                <input 
                  type="text" 
                  value={record.sku} 
                  onChange={(e) => handleEdit(index, 'sku', e.target.value)}
                />
              </td>
              <td>
                <input 
                  type="text" 
                  value={record.product_name} 
                  onChange={(e) => handleEdit(index, 'product_name', e.target.value)}
                />
              </td>
              <td>
                <input 
                  type="number" 
                  value={record.price} 
                  onChange={(e) => handleEdit(index, 'price', e.target.value)}
                />
              </td>
              <td>
                <input 
                  type="string" 
                  value={record.date} 
                  onChange={(e) => handleEdit(index, 'date', e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleSave}>Save Changes</button>
    </div>
  );
}

export default PricingTable;
