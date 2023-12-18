import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
  // Add more news items as needed
];


const ViewTickers = () => {
  const [records, setRecords] = useState([]);
  const [news, setNews] = useState([]);
  const [stocks, setStocks] = useState([]);
  const hardcodedNews = exampleNews;



  useEffect(() => {
    // Fetch stocks from your Express server
    fetch('/api/stocks')
      .then((response) => response.json())
      .then((data) => setStocks(data))
      .catch((error) => console.error('Error fetching stocks:', error));
  }, []);

  useEffect(() => {
    const apiKey = '67c2e55c595c4c9576d78ed6dcc46b75';
    const apiUrlRecords = '/api/records';  // Update with your actual API endpoint for records
    const apiUrlNews = `https://gnews.io/api/v4/top-headlines?token=${apiKey}`;

    const fetchRecords = async () => {
      try {
        const response = await axios.get(apiUrlRecords);
        setRecords(response.data);
      } catch (error) {
        console.error('Error fetching records:', error);
      }
    };

    const fetchNews = async () => {
      try {
        const response = await axios.get(apiUrlNews);
        setNews(response.data.articles);
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };

    fetchRecords();
    fetchNews();
  }, []);




  const handleAddToFavourite = (recordId) => {
    // Implement the logic to add the record to the favourite list
    console.log(`Added record with ID ${recordId} to favourites`);
  };

  return (
    <div>
      <center><h1>Stocks Page (to be deleted)</h1></center>
      {/* Add to Favourite Button */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' }}>
        <button onClick={() => handleAddToFavourite(1)} style={submitButtonStyle}>
          Add to Favourite
        </button>
      </div>
      {/* Records Container */}
      <div className="records-container">
        <center><h2>Records (to be deleted)</h2></center>
        {records.map((record) => (
          <div key={record._id}>
            <h3>{record.name}</h3>
            <p>{record.description}</p>
            <p>Price: ${record.price}</p>
            <button onClick={() => handleAddToFavourite(record._id)}>Add to Favourite</button>
          </div>
        ))}
      </div>

      {news.length > 0 ? (
        <div style={{ margin: '20px', alignItems: "center" }}>
          <h2>Latest News</h2>
          {news.map((article, index) => (
            <div key={index} style={{ marginBottom: '20px' }}>
              <h3>{article.title}</h3>
              <p>{article.description}</p>
              <a href={article.url} target="_blank" rel="noopener noreferrer">
                Read More
              </a>
            </div>
          ))}
        </div>
      ) : (
        <center><p>No news available.</p></center>
      )}

<div className="App">
      <ul>
        {stocks.map((stock) => (
          <li key={stock._id}>
            <strong>{stock.symbol}</strong> - {stock.companyName}
          </li>
        ))}
      </ul>
    </div>

    <div>
      {/* Other components... */}
      
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

      {/* Other components... */}
    </div>

      {/* Footer */}
      <footer style={{ padding: '10px', marginTop: '80px', backgroundColor: '#f4f4f4', textAlign: 'center' }}>
        <p>&copy; 2023 Bulls Ai. All rights reserved.</p>
      </footer>
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
