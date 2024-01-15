// MainPage.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MainPage = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []); // Empty dependency array to fetch data on component mount

  const fetchData = async () => {
    try {
      setIsLoading(true);

      // Fetch data from the /api/data endpoint
      const response = await fetch(`http://localhost:5050/api/data`);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const tickersData = await response.json();
      setData(tickersData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setErrorMessage('Error fetching data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    const trimmedSearchTerm = searchTerm.toString().trim();
    const encodedSearchTerm = encodeURIComponent(trimmedSearchTerm);

    if (!trimmedSearchTerm) {
      setErrorMessage('Please enter a search term.');
      return;
    }

    try {
      console.log('Sending request with search term:', encodedSearchTerm);

      const response = await fetch(`http://localhost:5050/api/search?q=${encodedSearchTerm}`);
      const searchData = await response.json();

      console.log('Filtered Data:', searchData);

      // Navigate to the ViewTickers page with search results and search term
      navigate('/viewTickers', { state: { searchResults: searchData, searchTerm: trimmedSearchTerm } });
    } catch (error) {
      console.error('Error searching data:', error);
    }
  };

  return (
    <div style={{ textAlign: 'center', margin: '20px' }}>
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

      {isLoading ? (
        <p>Loading...</p>
      ) : data.length > 0 ? (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #ddd' }}>
              <th style={{ padding: '10px', textAlign: 'center' }}>Recommended for you</th>
              <th style={{ padding: '10px', textAlign: 'center' }}>Sectors</th>
              <th style={{ padding: '10px', textAlign: 'center' }}>Industries</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '10px' }}>{item.column1}</td>
                <td style={{ padding: '10px' }}>{item.column2}</td>
                <td style={{ padding: '10px' }}>{item.column3}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No data available.</p>
      )}

      <footer style={{ marginTop: '600px', padding: '10px', backgroundColor: '#f4f4f4' }}>
        <p>&copy; 2023 Bulls Ai. All rights reserved.</p>
      </footer>
    </div>
  );
};

const submitButtonStyle = {
  backgroundColor: '#321FDE',
  color: 'white',
  padding: '10px 15px',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};

export default MainPage;