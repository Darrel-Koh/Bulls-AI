import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Typography, Button, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Link } from '@mui/material';
import { grey } from '@mui/material/colors';
import "../components/style.css";

const ViewTickers = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { searchResults, searchTerm } = location.state || {};
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const [relatedNews, setRelatedNews] = useState([]);
  const [loadingNews, setLoadingNews] = useState(true);

  useEffect(() => {
    console.log('Fetching related news for:', searchTerm);
    const apiKey = '466de00744114cc8be03ca388f1f816f';

    const fetchRelatedNews = async () => {
      try {
        const stocksKeywords = ['stocks', 'financial', 'market', 'finance'];
        const searchTermWithKeywords = `${searchTerm} ${stocksKeywords.join(' OR ')}`;
        const url = `https://newsapi.org/v2/everything?q=${searchTermWithKeywords}&apiKey=${apiKey}&language=en&sortBy=publishedAt&sources=bbc-news`;

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        const limitedNews = data.articles.slice(0, 3);

        setRelatedNews(limitedNews);
      } catch (error) {
        console.error('Error fetching related news:', error);
      } finally {
        console.log('Finished fetching related news');
        setLoadingNews(false);
      }
    };

    if (searchTerm) {
      fetchRelatedNews();
    }
  }, [searchTerm]);

  useEffect(() => {
    console.log('Search Term:', searchTerm);
    console.log('Search Results:', searchResults);
  }, [searchResults, searchTerm]);

  const handleAddToFavourite = (recordId) => {
    console.log(`Added record with ID ${recordId} to favourites`);
  };

  const renderTable = () => {
    // Wrap the single object in an array if it's not already an array
    const dataArray = Array.isArray(searchResults) ? searchResults : [searchResults];
  
    if (dataArray.length === 0) {
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
            {dataArray.map((result, index) => (
              <TableRow key={result._id} style={{ background: index % 2 === 0 ? grey[200] : 'white' }}>
                <TableCell style={tableCellStyle}>{result.trading_name}</TableCell>
                <TableCell style={tableCellStyle}>{result.symbol}</TableCell>
                <TableCell style={tableCellStyle}>
                  {result.transactions.length > 0 && result.transactions[result.transactions.length - 1].Date}
                </TableCell>
                <TableCell style={tableCellStyle}>
                  {result.transactions.length > 0 && result.transactions[result.transactions.length - 1]['Adj Close']}
                </TableCell>
                <TableCell style={tableCellStyle}>
                  {result.transactions.length > 0 && result.transactions[result.transactions.length - 1].Volume}
                </TableCell>
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
        ) : Array.isArray(relatedNews) && relatedNews.length > 0 ? (
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
      <div style={{ marginTop: '100px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '20px' }}>
        <Button onClick={() => navigate('/mainPage')} variant="contained" style={returnButtonStyle}>
          Return to Main Page
        </Button>
      </div>

      {renderTable()}
      {searchTerm && renderRelatedNews()}

      <footer className="footer">
        <Typography variant="body2">&copy; 2023 Bulls Ai. All rights reserved.</Typography>
      </footer>
    </div>
  );
};

const favouriteButtonStyle = {
  backgroundColor: '#FFD700',
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