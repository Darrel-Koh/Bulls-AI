import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../components/style.css";
import { TextField, Button, Table, TableHead, TableBody, TableRow, TableCell, Typography, IconButton, Box, Grid, CircularProgress } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Link } from 'react-router-dom';
import { grey } from '@mui/material/colors';
import { Snackbar } from '@mui/material';

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
  const [tickerData, setTickerData] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Inside your fetch and search functions where errors occur
  const handleFetchError = (errorMessage) => {
    setSnackbarMessage(errorMessage);
    setSnackbarOpen(true);
  };

  // Inside your handleSearch function
  const handleSearchError = (errorMessage) => {
    setSnackbarMessage(errorMessage);
    setSnackbarOpen(true);
    setIsLoading(false); // Ensure loading indicator is stopped
  };

  const handleSnackbarOpen = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };


  // useEffect(() => {
  //   fetchData();
  // }, []);

  // const fetchData = async () => {
  //   try {
  //     setIsLoading(true);
  //     setErrorMessage('');
  
  //     // Fetch data from the /api/data endpoint
  //     const response = await fetch(`${process.env.REACT_APP_BASE_URL}/recommendation-data`);
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const recommendationDataArray = await response.json();
      setData(recommendationDataArray);
  
      const tickerDataPromises = recommendationDataArray.map(async (recommendationData) => {
        const tickerId = recommendationData.ticker_id;
        
  
        try {
          const tickerResponse = await fetch(`${process.env.REACT_APP_BASE_URL}/recommendation-data/ticker/${encodeURIComponent(tickerId)}`);
          if (!tickerResponse.ok) {
            throw new Error(`Failed to fetch ticker data: ${tickerResponse.statusText}`);
          }
  
          const tickerData = await tickerResponse.json();
          return {
            tickerId,
            tickerData,
          };
        } catch (error) {
          console.error('Error fetching ticker data:', error);
          return null;
        }
      });
  
      const tickerDataResults = await Promise.all(tickerDataPromises);
      setTickerData(tickerDataResults.filter(Boolean));
      
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
      setIsLoading(true); // Start loading feedback

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
        setSnackbarMessage('Search request failed.');
        setSnackbarOpen(true);
        return;
      }

      const searchData = await response.json();
      navigate('/viewTickers', { state: { searchResults: searchData, searchTerm: trimmedSearchTerm } });
    } catch (error) {
      console.error("Error searching data:", error);
      handleSearchError('Error searching data. Please try again.'); // Handle error with Snackbar
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
  
  const formatTo3SF = (number) => {
    if (number === null || isNaN(number)) {
      return '-';
    }
  
    // Convert to a number with 3 significant figures
    const formattedNumber = Number.parseFloat(number).toPrecision(3);
  
    return formattedNumber;
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
          
            <TableCell onClick={() => handleSort('open')}>
              Open {sortBy === 'open' && (
                <span>{sortDirection === 'asc' ? ' ▲' : ' ▼'}</span>
              )}
            </TableCell>
            <TableCell onClick={() => handleSort('adjclose')}>
              Adj Close {sortBy === 'adjclose' && (
                <span>{sortDirection === 'asc' ? ' ▲' : ' ▼'}</span>
              )}
            </TableCell>
            <TableCell onClick={() => handleSort('volume')}>
              Volume {sortBy === 'volume' && (
                <span>{sortDirection === 'asc' ? ' ▲' : ' ▼'}</span>
              )}
            </TableCell>
          </TableRow>
        </TableHead>
      

<TableBody>
  {data && Array.isArray(data) && data.map((item, index) => {
   const correspondingTickerData = tickerData.find(tickerItem => tickerItem.tickerId === item.ticker_id);

   const latestTransaction = correspondingTickerData ? correspondingTickerData.tickerData.transactions.reduce((latest, transaction) => {
     return latest.Date > transaction.Date ? latest : transaction;
   }, {}) : {};
   
    return (
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
        <TableCell>{latestTransaction ? formatTo3SF(latestTransaction.Open) : '-'}</TableCell>
        <TableCell>{latestTransaction ? formatTo3SF(latestTransaction['Adj Close']) : '-'}</TableCell>
        <TableCell>{latestTransaction ? latestTransaction.Volume : '-'}</TableCell>
      </TableRow>
    );
  })}
</TableBody>

      </Table>
    </div>
    
  
      <footer className="footer">
        <Typography variant="body2">&copy; 2023 Bulls Ai. All rights reserved.</Typography>
      </footer>


       {/* Snackbar for error messages */}
       <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }} // Adjust as needed
        action={
          <Button size="small" onClick={handleSnackbarClose}>
            Close
          </Button>
        }
      />

      {isLoading && (
        <CircularProgress size={24} color="inherit" />
      )}

      {!isLoading && data && data.length === 0 && (
        <Snackbar
          open={true} // Always open for showing the "No results found" message
          message="No results found."
        autoHideDuration={4000}
          onClose={handleSnackbarClose}
        />
      )}
    </div>

   
        
  );
};
  

export default MainPage;
