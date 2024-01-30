// viewTickers.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LazyLoad from 'react-lazyload';

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
        
        const stocksKeywords = ['stocks', 'financial', 'market']; // Add more keywords as needed
        const searchTermWithKeywords = `${searchTerm} ${stocksKeywords.join(' OR ')}`;
    
        const response = await fetch(`https://newsapi.org/v2/everything?q=${searchTermWithKeywords}&apiKey=${apiKey}`);  
        
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
  
  
  useEffect(() => {
    console.log('Search Term:', searchTerm);
    console.log('Search Results:', searchResults);
  }, [searchResults, searchTerm]);
 
// Filter data based on the search term
const filteredData = searchResults.filter((result) =>
  result.trading_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  result.symbol.toLowerCase().includes(searchTerm.toLowerCase())
);
console.log(filteredData);


  const displayedData = filteredData.slice(startIndex, endIndex);

  const handleAddToFavourite = (recordId) => {
    // Implement the logic to add the record to the favourite list
    console.log(`Added record with ID ${recordId} to favourites`);
  };

  
  // Displays search table
  const renderTable = () => {
    if (displayedData.length === 0) {
      return <p style={{ marginTop: '10px' }}>No data available for the search term: {searchTerm}</p>;
    }

    console.log(displayedData); // Add this line just before the return statement


    return (
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ddd', background: '#f2f2f2' }}>
            <th style={tableHeaderStyle}>Trading Name</th>
            <th style={tableHeaderStyle}>Symbol</th>
            <th style={tableCellStyle}>Transaction Count</th>
            <th style={tableHeaderStyle}>Bucket Start Date</th>
            <th style={tableHeaderStyle}>Bucket End Date</th>
            <th style={tableHeaderStyle}>Action</th> {/* New column for the action button */}
          </tr>
        </thead>
        <tbody>
        {displayedData.map((result, index) => (
              <tr key={result._id} style={{ borderBottom: '1px solid #ddd', background: index % 2 === 0 ? '#f9f9f9' : 'white' }}>
                <td style={tableCellStyle}>{result.trading_name}</td>
                <td style={tableCellStyle}>{result.symbol}</td>
              <td style={tableCellStyle}>{result.transaction_count}</td>
              <td style={tableCellStyle}>{result.bucket_start_date}</td>
              <td style={tableCellStyle}>{result.bucket_end_date}</td>
              <td style={tableCellStyle}>
                <button onClick={() => handleAddToFavourite(result._id)} style={favouriteButtonStyle}>
                  Add to Favourite
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )};

  
  const renderRelatedNews = () => {
    return (
      <LazyLoad height={200} offset={100} once>
        <div style={{ marginTop: '50px' }}>
          <h4 style={{ textAlign: 'left', marginBottom: '20px' }}>Related News</h4>
          {loadingNews ? (
            <p>Loading news...</p>
          ) : relatedNews.length > 0 ? (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {relatedNews.map((article, index) => (
                <li
                  key={index}
                  style={{ marginBottom: '20px', border: '1px solid #ddd', padding: '10px', borderRadius: '8px' }}
                >
                  <h5 style={{ margin: 0 }}>{article.title}</h5>
                  <p style={{ margin: '10px 0 0' }}>{article.description}</p>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'block', marginTop: '10px', color: '#007BFF', textDecoration: 'underline' }}
                  >
                    Read More
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p>No related news available.</p>
          )}
        </div>
      </LazyLoad>
    );
  };
  

  return (
    <div>
      {/* Add to Favourite Button */}
      <div style={{ marginTop: '100px', display: 'flex', justifyContent: 'right', alignItems: 'right', marginBottom: '20px' }}>
      <button onClick={() => navigate('/mainPage')} style={returnButtonStyle}>
          Return to Main Page
        </button>
      </div>

      {renderTable()}
      {searchTerm && renderRelatedNews()}


      {/* Footer */}
      <footer style={{ padding: '10px', marginTop: '80px', backgroundColor: '#f4f4f4', textAlign: 'center' }}>
        <p>&copy; 2023 Bulls Ai. All rights reserved.</p>
      </footer>
    </div>
  );
};

const favouriteButtonStyle = {
  backgroundColor: '#FFD700', // Yellow color for the favourite button
  color: 'black',
  padding: '8px 12px',
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

const returnButtonStyle = {
  backgroundColor: '#ccc',
  color: '#333',
  padding: '10px 15px',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};


export default ViewTickers;
