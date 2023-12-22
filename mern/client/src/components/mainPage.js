import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const MainPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState([]);
  const location = useLocation();
  const loggedInUser = location.state ? location.state.user : null;

  useEffect(() => {
    fetchData();
  }, [loggedInUser]); // Empty dependency array to fetch data on component mount

  const fetchData = async () => {
    try {
      // Fetch data from your API endpoint (replace with your actual API endpoint)
      const response = await axios.get(`http://localhost:5050/mainPage/`);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  console.log('Logged In User:', loggedInUser);

  const handleSearch = async () => {
    try {
      // Fetch filtered data based on the search term
      const response = await axios.get(`https://api.example.com/data?search=${searchTerm}`);
      setData(response.data);
    } catch (error) {
      console.error('Error searching data:', error);
    }
  };

  return (
    <div style={{ textAlign: 'center', margin: '40px'}}>
      <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column' }}>
        <input
          type="text"
          placeholder="Search for Tickers/Stocks"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ textAlign: 'center', padding: '8px', marginRight: '8px', width: "100%" }}
        />
        <button onClick={handleSearch} style={submitButtonStyle}>
          Search
        </button>
      </div>
      {data.length > 0 ? (
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

    <footer 
      style={{ marginTop: '600px', padding: '10px', backgroundColor: '#f4f4f4' }}
      
      >
        <p>&copy; 2023 Bulls Ai. All rights reserved.</p>
      </footer>
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
    marginBottom: '100px',
    marginTop: '10px'
  };


export default MainPage;