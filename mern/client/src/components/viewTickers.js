import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LazyLoad from 'react-lazyload';

const ViewTickers = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchResults = location.state?.searchResults || [];
  const searchTerm = location.state?.searchTerm || ''; // Get the search term from the location state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Adjust the number of items per page as needed
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const [newsData, setNewsData] = useState([]);
  const [relatedNews, setRelatedNews] = useState([]);
  const [loadingNews, setLoadingNews] = useState(true);

  useEffect(() => {
    console.log('Fetching related news for:', searchTerm);
    const apiKey = 'a1f6019d3f084b21bd71242f6629ef1b'; // Replace with your actual News API key
  
    const fetchRelatedNews = async () => {
      try {
        const response = await fetch(`https://newsapi.org/v2/everything?q=${searchTerm}&apiKey=${apiKey}`);
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const data = await response.json();
  
        // Limit the news to 5 articles
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
  
  
 
  // Filter data based on the search term
  const filteredData = searchResults.filter((result) =>
    result.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const displayedData = filteredData.slice(startIndex, endIndex);

  
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePageChange = (newPage) => {
  setCurrentPage(newPage);
};

// Render pagination controls (you can customize this based on your UI)
// Example: page numbers
const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  const handleAddToFavourite = (recordId) => {
    // Implement the logic to add the record to the favourite list
    console.log(`Added record with ID ${recordId} to favourites`);
  };



  return (
    <div>
      {/* Add to Favourite Button */}
      <div style={{ marginTop: '100px', display: 'flex', justifyContent: 'right', alignItems: 'right', marginBottom: '20px' }}>
      <button onClick={() => navigate('/mainPage')} style={returnButtonStyle}>
          Return to MainPage
        </button>
      </div>


      {displayedData.length > 0 ? (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
          <tr style={{ borderBottom: '2px solid #ddd', background: '#f2f2f2' }}>
              <th style={tableHeaderStyle}>ID</th>
              <th style={tableHeaderStyle}>Trading Name</th>
              <th style={tableHeaderStyle}>Symbol</th>
            { /* <th style={tableCellStyle}>Price Traded</th>
              <th style={tableCellStyle}>Direction</th>
      <th style={tableCellStyle}>Price Change Amount</th>*/}
              <th style={tableHeaderStyle}>Action</th> {/* New column for the action button */}

            </tr>
          </thead>
          <tbody>
          {displayedData.map((result, index) => (
              <tr key={result._id} style={{ borderBottom: '1px solid #ddd', background: index % 2 === 0 ? '#f9f9f9' : 'white' }}>
                <td style={tableCellStyle}>{result._id}</td>
                <td style={tableCellStyle}>{result.trading_name}</td>
                <td style={tableCellStyle}>{result.symbol}</td>

                {/*<td style={tableCellStyle}>{result.priceTraded}</td>
                <td style={tableCellStyle}>{result.direction}</td>
          <td style={tableCellStyle}>{result.priceChangeAmount}</td>*/}
                <td style={tableCellStyle}>
                  {/* Favourite Button for each row */}
                  <button onClick={() => handleAddToFavourite(result._id)} style={favouriteButtonStyle}>
                    Add to Favourite
                  </button>    
                  </td>          
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={{ marginTop: '10px' }}>No data available for the search term: {searchTerm}</p>
      )}

    
      {/* Improved Pagination controls */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={paginationButtonStyle}
        >
          &lt; Prev
        </button>
        {pageNumbers.map((pageNumber) => (
          <button
            key={pageNumber}
            onClick={() => handlePageChange(pageNumber)}
            style={{
              ...paginationButtonStyle,
              backgroundColor: currentPage === pageNumber ? '#321FDE' : '#fff',
              color: currentPage === pageNumber ? '#fff' : '#333',
            }}
          >
            {pageNumber}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={paginationButtonStyle}
        >
          Next &gt;
        </button>
      </div>

   {/* Lazy Loaded Related News Section */}
   {searchTerm && !loadingNews && (
        <LazyLoad height={200} offset={100} once>
          <div style={{ marginTop: '50px' }}>
            <h4 style={{ textAlign: 'left', marginBottom: '20px' }}>Related News</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {relatedNews.map((article, index) => (
                <li key={index} style={{ marginBottom: '20px', border: '1px solid #ddd', padding: '10px', borderRadius: '8px' }}>
                  <h5 style={{ margin: 0 }}>{article.title}</h5>
                  <p style={{ margin: '10px 0 0' }}>{article.description}</p>
                  <a href={article.url} target="_blank" rel="noopener noreferrer" style={{ display: 'block', marginTop: '10px', color: '#007BFF', textDecoration: 'underline' }}>
                    Read More
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </LazyLoad>
      )}

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

const paginationButtonStyle = {
  backgroundColor: '#fff',
  color: '#333',
  padding: '10px 15px',
  border: '1px solid #ccc',
  borderRadius: '4px',
  cursor: 'pointer',
  margin: '0 5px',
};
export default ViewTickers;
