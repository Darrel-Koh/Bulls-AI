import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../components/style.css";
import { TextField, Button, Table, TableHead, TableBody, TableRow, TableCell, Typography, IconButton, Box, Grid, CircularProgress } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Link } from 'react-router-dom';

const MainPage = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setErrorMessage('');

      const response = await fetch('http://localhost:5050/recommendation-data');
      
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
    const trimmedSearchTerm = searchTerm.trim();
    const encodedSearchTerm = encodeURIComponent(trimmedSearchTerm);
  
    if (!trimmedSearchTerm) {
      setErrorMessage('Please enter a search term.');
      return;
    }
  
    try {
      setIsLoading(true); // Start loading when search is initiated

      const response = await fetch(`http://localhost:5050/api/search?q=${encodedSearchTerm}`);
  
      if (!response.ok) {
        console.error('Search request failed:', response.status, response.statusText);
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

      const response = await fetch(`http://localhost:5050/api/search?q=${encodedSearchTerm}`);
  
      if (!response.ok) {
        console.error('Search request failed:', response.status, response.statusText);
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

  return (
    <div className="main-container">
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
            disabled={isLoading}
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
      {errorMessage && <Typography variant="body1" className="error-message">{errorMessage}</Typography>}
  
      {isLoading && (
        <Typography variant="body1" className="loading-message">Loading...</Typography>
      )}
  
      {/* Empty table with recommendations */}
      <div className="recommendations-container">
  <Typography variant="h6">Recommendations</Typography>
  <Table>
    <TableHead>
      <TableRow>
        <TableCell>Trading Name</TableCell>
        <TableCell>Symbol</TableCell>
        <TableCell>Last</TableCell>
        <TableCell>Change</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {data.map((item, index) => (
        <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
          <TableCell>
          <Link
          // to="/viewTickers"
          className="trading-link"
          onClick={() => handleSearchLink(item.trading_name)}
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
