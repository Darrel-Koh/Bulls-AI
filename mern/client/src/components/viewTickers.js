import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const exampleNews = [
  {
    title: 'Stocks Surge to Record Highs',
    description: 'The stock market experienced a significant surge, reaching record highs across major indices.',
    url: 'https://solss.uow.edu.au/sid/sols_login_ctl.login',
  },
  {
    title: 'Tech Giants Report Strong Earnings',
    description: 'Leading technology companies announced robust earnings for the latest quarter, exceeding expectations.',
    url: 'https://example.com/news2',
  },
];

const ViewTickers = () => {
  const hardcodedNews = exampleNews;
  const location = useLocation();
  const navigate = useNavigate();
  const searchResults = location.state?.searchResults || [];
  const searchTerm = location.state?.searchTerm || ''; // Get the search term from the location state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Adjust the number of items per page as needed
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

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
              <th style={tableCellStyle}>ID</th>
              <th style={tableCellStyle}>Symbol</th>
              <th style={tableCellStyle}>Shares</th>
              <th style={tableCellStyle}>Price Traded</th>
              <th style={tableCellStyle}>Direction</th>
              <th style={tableCellStyle}>Price Change Amount</th>
              <th style={tableHeaderStyle}>Action</th> {/* New column for the action button */}

            </tr>
          </thead>
          <tbody>
          {displayedData.map((result, index) => (
              <tr key={result._id} style={{ borderBottom: '1px solid #ddd', background: index % 2 === 0 ? '#f9f9f9' : 'white' }}>
              <td>{result._id}</td>
                <td style={tableCellStyle}>{result.symbol}</td>
                <td style={tableCellStyle}>{result.shares}</td>
                <td style={tableCellStyle}>{result.priceTraded}</td>
                <td style={tableCellStyle}>{result.direction}</td>
                <td style={tableCellStyle}>{result.priceChangeAmount}</td>
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

      {/* News Section */}
      <div style={{ marginTop: '500px' }}>
        <ul>
          <h3>Latest News</h3>
          <div>
            {hardcodedNews.map((article, index) => (
              <div key={index} style={{ marginBottom: '20px' }}>
                <h4 style={{ textDecoration: 'underline' }}>{article.title}</h4>
                <p>{article.description}</p>
                <a href={article.url} target="_blank" rel="noopener noreferrer">
                  Read More
                </a>
              </div>
            ))}
          </div>
        </ul>
      </div>

      {/* Footer */}
      <footer style={{ padding: '10px', marginTop: '80px', backgroundColor: '#f4f4f4', textAlign: 'center' }}>
        <p>&copy; 2023 Bulls Ai. All rights reserved.</p>
      </footer>
    </div>
  );
};

const submitButtonStyle = {
  backgroundColor: '#321FDE',
  color: 'white',
  padding: '10px 15px',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  marginBottom: '10px',
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
