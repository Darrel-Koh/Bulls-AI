import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchStocks from './SearchStocks'; // Import the SearchStocks component
import { useNavigate } from 'react-router-dom';


const MainPage = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []); // Empty dependency array to fetch data on component mount

  const fetchData = async () => {
    try {
      // Fetch data from your API endpoint (replace with your actual API endpoint)
      const response = await axios.get(`http://localhost:5050/api/data`);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


  const handleSearch = async (searchTerm) => {
    try {
        if (!searchTerm.trim()) {
          setErrorMessage('Please enter a search term.');
          return;
        }
      // Fetch filtered data based on the search term
      // Assuming you have an endpoint like /api/search in your Express server
      const response = await axios.get(`http://localhost:5050/api/search?q=${searchTerm}`);
      setData(response.data);
      
      // Navigate to the ViewTickers page with search results
      navigate('/viewTickers', { state: { searchResults: response.data } });
    } catch (error) {
      console.error('Error searching data:', error);
    }
  };
 
  
  return (
    
      <div style={{ textAlign: 'center', margin: '20px'}}>
      <SearchStocks onSearch={handleSearch} /> {/* Include the SearchStocks component */}
      
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

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

    <footer style={{ marginTop: '600px', padding: '10px', backgroundColor: '#f4f4f4' }}>
        <p>&copy; 2023 Bulls Ai. All rights reserved.</p>
      </footer>
    </div>
  );
};



export default MainPage;
