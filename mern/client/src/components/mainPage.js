import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../components/style.css";
import { TextField, Button, Table, TableHead, TableBody, TableRow, TableCell, Typography, IconButton, Box, Grid } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

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
    const trimmedSearchTerm = searchTerm.trim();
    const encodedSearchTerm = encodeURIComponent(trimmedSearchTerm);
  
    if (!trimmedSearchTerm) {
      setErrorMessage('Please enter a search term.');
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:5050/api/search?q=${encodedSearchTerm}`);
  
      if (!response.ok) {
        console.error('Search request failed:', response.status, response.statusText);
        return;
      }
  
      const searchData = await response.json();
      navigate('/viewTickers', { state: { searchResults: searchData, searchTerm: trimmedSearchTerm } });
    } catch (error) {
      console.error("Error searching data:", error);
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
        >
          Search
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
    {isLoading && <Typography variant="body1" className="loading-message">Loading...</Typography>}

      {/* Empty table with recommendations */}
      <div className="recommendations-container">
        <Typography variant="h6">Recommendations</Typography>
        <Table className="recommendations-table">
          <TableHead>
            <TableRow>
              <TableCell>Trading Name</TableCell>
              <TableCell>Symbol</TableCell>
              <TableCell>Recommendation Score</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={index} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                {/* You can fill in the table cells with relevant data */}
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
