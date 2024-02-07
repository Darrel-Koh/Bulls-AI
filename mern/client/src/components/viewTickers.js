import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Typography, Button, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Link } from '@mui/material';
import { grey } from '@mui/material/colors';import "../components/style.css";

const ViewTickers = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { searchResults, searchTerm } = location.state || {};
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Adjust the number of items per page as needed
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const [relatedNews, setRelatedNews] = useState([]);
  const [loadingNews, setLoadingNews] = useState(true);

 // News Section 
useEffect(() => {
  console.log('Fetching related news for:', searchTerm);
  const apiKey = 'a1f6019d3f084b21bd71242f6629ef1b'; // Replace with your actual News API key

  const fetchRelatedNews = async () => {
    try {
      const stocksKeywords = ['stocks', 'financial', 'market', 'finance']; // Add more keywords as needed
      const searchTermWithKeywords = `${searchTerm} ${stocksKeywords.join(' OR ')}`;

      // Construct the URL with language and sortBy parameters
      const url = `https://newsapi.org/v2/everything?q=${searchTermWithKeywords}&apiKey=${apiKey}&language=en&sortBy=publishedAt`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      // Limit the news to 3 articles
      const limitedNews = data.articles.slice(0, 3);

      setRelatedNews(limitedNews);
    } catch (error) {
      console.error('Error fetching related news:', error);
    } finally {
      console.log('Finished fetching related news');
      setLoadingNews(false);
    }
  };

  // Fetch related news when the component mounts or when the search term changes
  if (searchTerm) {
    fetchRelatedNews();
  }
}, [searchTerm]);

// search
useEffect(() => {
  console.log('Search Term:', searchTerm);
  console.log('Search Results:', searchResults);
}, [searchResults, searchTerm]);

// Filter data based on the search term
// const filteredData = searchResults.filter((result) =>
// result.trading_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
// result.symbol.toLowerCase().includes(searchTerm.toLowerCase())
// );
const filteredData = searchResults.filter((result) => {
  const tradingName = result?.trading_name?.toLowerCase() || ''; // Check if trading_name is defined
  const symbol = result?.symbol?.toLowerCase() || ''; // Check if symbol is defined

  return tradingName.includes(searchTerm.toLowerCase()) || symbol.includes(searchTerm.toLowerCase());
});


const displayedData = filteredData.slice(startIndex, endIndex);

const handleAddToFavourite = (recordId) => {
  // Implement the logic to add the record to the favourite list
  console.log(`Added record with ID ${recordId} to favourites`);
};
  
  // Displays search table
  const renderTable = () => {
    if (displayedData.length === 0) {
      return <Typography variant="body1" style={{ marginTop: '10px' }}>No data available for the search term: {searchTerm}</Typography>;
    }

    return (
      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={tableHeaderStyle}>Trading Name</TableCell>
              <TableCell style={tableHeaderStyle}>Symbol</TableCell>
              <TableCell style={tableHeaderStyle}>Transaction Date</TableCell>
              <TableCell style={tableHeaderStyle}>Adj Close</TableCell>
              <TableCell style={tableHeaderStyle}>Volume</TableCell>
              <TableCell style={tableHeaderStyle}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedData.map((result, index) => (
              <TableRow key={result._id} style={{ background: index % 2 === 0 ? grey[200] : 'white' }}>
                <TableCell style={tableCellStyle}>{result.trading_name}</TableCell>
                <TableCell style={tableCellStyle}>{result.symbol}</TableCell>
                {/* <TableCell style={tableCellStyle}>
                  {result.transactions.length > 0 && result.transactions[result.transactions.length - 1].Date}
                </TableCell>
                <TableCell style={tableCellStyle}>
                  {result.transactions.length > 0 && result.transactions[result.transactions.length - 1]['Adj Close']}
                </TableCell>
                <TableCell style={tableCellStyle}>
                  {result.transactions.length > 0 && result.transactions[result.transactions.length - 1].Volume}
                </TableCell> */}
                <TableCell style={tableCellStyle}>
                  <Button onClick={() => handleAddToFavourite(result._id)} variant="contained" style={favouriteButtonStyle}>
                    Add to Favourite
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const renderRelatedNews = () => {
    return (
      
      <div style={{ marginTop: '50px' }}>
      <Typography variant="h6" style={{ marginBottom: '20px' }}>Related News</Typography>
      {loadingNews ? (
        <CircularProgress />
      ) : relatedNews.length > 0 ? (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {relatedNews.map((article, index) => (
            <li key={index} style={{ marginBottom: '20px', border: '1px solid #ddd', padding: '10px', borderRadius: '8px' }}>
              <Typography variant="h6">{article.title}</Typography>
              <Typography variant="body1" style={{ margin: '10px 0 0' }}>{article.description}</Typography>
              <Link href={article.url} target="_blank" rel="noopener noreferrer" style={{ display: 'block', marginTop: '10px', color: '#007BFF', textDecoration: 'underline' }}>
                Read More
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <Typography variant="body1">No related news available.</Typography>
      )}
    </div>
    
    );
  };


  return (
    <div>
      {/* Add to Favourite Button */}
      <div style={{ marginTop: '100px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '20px' }}>
        <Button onClick={() => navigate('/mainPage')} variant="contained" style={returnButtonStyle}>
          Return to Main Page
        </Button>
      </div>

      {renderTable()}
      {searchTerm && renderRelatedNews()}

      {/* Footer */}
      <footer className="footer">
        <Typography variant="body2">&copy; 2023 Bulls Ai. All rights reserved.</Typography>
      </footer>
    </div>
  );
};

const favouriteButtonStyle = {
  backgroundColor: '#FFD700', // Yellow color for the favourite button
  color: 'black',
  padding: '8px 12px',
  borderRadius: '4px',
  cursor: 'pointer',
};

const tableHeaderStyle = {
  padding: '10px',
  textAlign: 'center',
  fontWeight: 'bold',
};

const tableCellStyle = {
  padding: '10px',
  textAlign: 'center',
};

const returnButtonStyle = {
  backgroundColor: grey[400],
  color: 'black',
  padding: '10px 15px',
  borderRadius: '4px',
  cursor: 'pointer',
};

export default ViewTickers;