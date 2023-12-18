//import axios from 'axios';
import { useLocation } from 'react-router-dom';


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
  const searchResults = location.state?.searchResults || [];



  const handleAddToFavourite = (recordId) => {
    // Implement the logic to add the record to the favourite list
    console.log(`Added record with ID ${recordId} to favourites`);
  };

  return (
    <div>
      {/* Add to Favourite Button */}
      <div style={{ marginTop: "100px", display: 'flex', justifyContent: 'right', alignItems: 'right', marginBottom: '20px' }}>
        <button onClick={() => handleAddToFavourite(1)} style={submitButtonStyle}>
          Add to Favourite
        </button>
      </div>
  

      {searchResults.length > 0 ? (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Symbol</th>
              <th>Shares</th>
              <th>Price Traded</th>
              <th>Direction</th>
              <th>Price Change Amount</th>
            </tr>
          </thead>
          <tbody>
            {searchResults.map((result) => (
              <tr key={result._id}>
                <td>{result._id}</td>
                <td>{result.symbol}</td>
                <td>{result.shares}</td>
                <td>{result.priceTraded}</td>
                <td>{result.direction}</td>
                <td>{result.priceChangeAmount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No data available for the search term.</p>
      )}
    

    <div>
    
      
      {/* News Section */}
      <div style={{ marginTop: '500px'  }}>
        <ul><h3>Latest News</h3>
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
    </div>
  );
};

const submitButtonStyle = {
  backgroundColor: '#4CAF50',
  color: 'white',
  padding: '10px 15px',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  marginBottom: '10px',
};

export default ViewTickers;
