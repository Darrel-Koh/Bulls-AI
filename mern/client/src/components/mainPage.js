// MainPage.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MainPage = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

    useEffect(() => {
    fetchData();
  }, [currentPage, pageSize]); // Update data when currentPage or pageSize changes

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

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
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
        <>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', border: '1px solid #ddd' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #ddd', background: '#f2f2f2' }}>
                <th style={tableHeaderStyle}>ID</th>
                <th style={tableHeaderStyle}>Recommended for you</th>
                <th style={tableHeaderStyle}>Sectors</th>
                <th style={tableHeaderStyle}>Industries</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #ddd', background: index % 2 === 0 ? '#f9f9f9' : 'white' }}>
                  <td style={tableCellStyle}>{item._id}</td>
                  <td style={tableCellStyle}>{item.column1}</td>
                  <td style={tableCellStyle}>{item.column2}</td>
                  <td style={tableCellStyle}>{item.column3}</td>
                </tr>
              ))}
            </tbody>
          </table>

            {/* Pagination */}
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              style={paginationButtonStyle}
            >
              Previous
            </button>
            <span style={{ margin: '0 10px', fontSize: '16px', fontWeight: 'bold' }}>{`Page ${currentPage}`}</span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={data.length < pageSize}
              style={paginationButtonStyle}
            >
              Next
            </button>
          </div>
        </>
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

const tableHeaderStyle = {
  padding: '10px',
  textAlign: 'center',
  fontWeight: 'bold',
  border: '1px solid #ddd',
};

const tableCellStyle = {
  padding: '10px',
  textAlign: 'center',
  border: '1px solid #ddd',
};


const paginationButtonStyle = {
  backgroundColor: '#321FDE',
  color: 'white',
  padding: '10px 15px',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  margin: '0 5px',
};

export default MainPage;