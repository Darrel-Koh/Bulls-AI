// SearchStocks.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SearchStocks = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  const handleSearch = async () => {
    try {
        if (!searchTerm.trim()) {
            setErrorMessage('Please enter a search term.');
            return;
          }
      // Fetch filtered data based on the search term
      // Assuming you have an endpoint like /api/search in your Express server
      const response = await axios.get(`http://localhost:5050/api/search?q=${searchTerm}`);
      onSearch(response.data); // Pass the search results to the parent component
      navigate('/viewTickers', { state: { searchResults: response.data } });
    } catch (error) {
      console.error('Error searching data:', error);
    }
  };

  return (
    <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column' }}>
      <input
        type="text"
        placeholder="Search for Tickers/Stocks"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ textAlign: 'center', padding: '8px', marginRight: '8px' }}
      />
      <button onClick={handleSearch} style={submitButtonStyle}>
        Search
      </button>

      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

    </div>
  );
};

const submitButtonStyle = {
  backgroundColor: '#4CAF50',
  color: 'white',
  padding: '10px 15px',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};

export default SearchStocks;

