import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../components/style.css";
import { TextField, Button, Table, TableHead, TableBody, TableRow, TableCell, Typography, IconButton, Box, Grid, CircularProgress } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Link } from 'react-router-dom';
import { grey } from '@mui/material/colors';

const MainPage = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState(''); // State to track sorting column
  const [sortDirection, setSortDirection] = useState('asc'); // State to track sorting direction
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setErrorMessage('');
  
      // Fetch data from the /api/data endpoint
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/recommendation-data`);
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const tickersData = await response.json();
      console.log('API Response:', tickersData);
      setData(tickersData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setErrorMessage("Error fetching data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    // Retrieve user data from local storage
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
        setUserData(JSON.parse(storedUserData));
    }
}, []);
  


  const handleSearch = async () => {
    const trimmedSearchTerm = searchTerm.trim();
    const encodedSearchTerm = encodeURIComponent(trimmedSearchTerm);
  
    if (!trimmedSearchTerm) {
      setErrorMessage('Please enter a search term.');
      return;
    }
  
    try {
      console.log("Sending request with search term:", encodedSearchTerm);

      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/mainPage/search/${encodedSearchTerm}`
      );
      console.log("Response:", response);

      if (!response.ok) {
        console.error(
          "Search request failed:",
          response.status,
          response.statusText
        );
        return;
      }

      const searchData = await response.json();
      navigate('/viewTickers', { state: { searchResults: searchData, searchTerm: trimmedSearchTerm } });
    } catch (error) {
      console.error("Error searching data:", error);
    } finally {
      setIsLoading(false); // Stop loading when search completes
    }
  };
  const handleSearchLink = async (LinkParams) => {
    const trimmedLinkParams = LinkParams.trim();
    const encodedSearchTerm = encodeURIComponent(trimmedLinkParams);
  
    try {
      setIsLoading(true); // Start loading when search is initiated

      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/mainPage/search/${encodedSearchTerm}`);
  
      if (!response.ok) {
        console.error(
          "Search request failed:",
          response.status,
          response.statusText
        );
        return;
      }

      const searchData = await response.json();
      navigate('/viewTickers', { state: { searchResults: searchData, searchTerm: trimmedLinkParams } });
    } catch (error) {
      console.error("Error searching data:", error);
    } finally {
      setIsLoading(false); // Stop loading when search completes
    }
  };

  const handleInputChange = (value) => {
    setSearchTerm(value);
    const filteredSuggestions = data.filter(item =>
      item.trading_name.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestions(filteredSuggestions);
  };

  // Function to sort data based on the selected column and direction
  const sortData = (column) => {
    const sortedData = [...data].sort((a, b) => {
      if (a[column] < b[column]) return sortDirection === 'asc' ? -1 : 1;
      if (a[column] > b[column]) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    setData(sortedData);
  };

  // Function to toggle sorting direction
  const toggleSortDirection = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };

  // Function to handle sorting when a column header is clicked
  const handleSort = (column) => {
    if (sortBy === column) {
      toggleSortDirection(); // If the same column is clicked, toggle direction
    } else {
      setSortBy(column); // Set the new sorting column
      setSortDirection('asc'); // Reset direction to ascending
    }
    sortData(column);
  };
  

  return (
    <div className="main-container">
      {userData && (
                <Typography variant="h4" gutterBottom>
                    Welcome, {userData.username}!
                </Typography>
            )}
      <Grid container alignItems="center" spacing={2}>
        <Grid item xs={10}>
          <TextField
            type="text"
            placeholder="Search for Tickers/Stocks"
            value={searchTerm}
            onChange={(e) => handleInputChange(e.target.value)}
            className="search-input"
            list="suggestions"
            fullWidth // Make the text field take full width
          />
        </Grid>
        <Grid item xs={2}> {/* Adjusted Grid size */}
          <Button
            onClick={handleSearch}
            className="button-search"
            variant="contained"
            color="primary"
            startIcon={<SearchIcon />}
            style={{ height: '56px', minWidth: "120px" }} // Adjusted button size and width
            disabled={isLoading || searchTerm.trim() === ''}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" /> // Display CircularProgress when loading
            ) : (
              'Search'
            )}
          </Button>
        </Grid>
      </Grid>
      {searchTerm && (
        <datalist id="suggestions">
          {suggestions.map((item, index) => (
            <option key={index} value={item.trading_name} />
          ))}
        </datalist>
      )}
     {!isLoading && data && data.length === 0 && (
        <Typography variant="body1" className="no-results-message">No results found.</Typography>
      )}

      {errorMessage && (
        <Typography variant="body1" className="error-message">{errorMessage}</Typography>
      )}

      {isLoading && (
        <Typography variant="body1" className="loading-message">Loading...</Typography>
      )}
  
      {/* Empty table with recommendations */}
      <div className="recommendations-container">
      <Typography variant="h6" style={{ marginBottom: '16px', fontWeight: 'bold' }}>Top 10 Recommendations</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell onClick={() => handleSort('trading_name')}>
              Trading Name {sortBy === 'trading_name' && (
                <span>{sortDirection === 'asc' ? ' ▲' : ' ▼'}</span>
              )}
            </TableCell>
            <TableCell onClick={() => handleSort('symbol')}>
              Symbol {sortBy === 'symbol' && (
                <span>{sortDirection === 'asc' ? ' ▲' : ' ▼'}</span>
              )}
            </TableCell>
            <TableCell onClick={() => handleSort('last')}>
              Last {sortBy === 'last' && (
                <span>{sortDirection === 'asc' ? ' ▲' : ' ▼'}</span>
              )}
            </TableCell>
            <TableCell onClick={() => handleSort('chng')}>
              Change {sortBy === 'chng' && (
                <span>{sortDirection === 'asc' ? ' ▲' : ' ▼'}</span>
              )}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {data && Array.isArray(data) && data.map((item, index) => (
          <TableRow key={index} style={{ backgroundColor: index % 2 === 0 ? grey[200] : 'white' }}>
            <TableCell>
              <Link
                className="trading-link"
                onClick={() => handleSearchLink(item.trading_name)}
                style={{ color: '#007bff', cursor: 'pointer' }}
              >
                {item.trading_name}
              </Link>
            </TableCell>
            <TableCell>{item.symbol}</TableCell>
            <TableCell>{item.last.toFixed(2)}</TableCell>
            <TableCell className={item.chng > 0 ? 'positive-change' : 'negative-change'}>
              {item.chng > 0 ? `+${item.chng}` : item.chng}
            </TableCell>
          </TableRow>
        ))}
        </TableBody>
      </Table>
    </div>
  
      <footer className="footer">
        <Typography variant="body2">&copy; 2023 Bulls Ai. All rights reserved.</Typography>
      </footer>
    </div>
  );
};
  

export default MainPage;
