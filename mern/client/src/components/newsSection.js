// src/NewsSection.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NewsSection = () => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    // Replace 'YOUR_API_KEY' with your actual gnews.io API key
    const apiKey = '67c2e55c595c4c9576d78ed6dcc46b75';
    const apiUrl = `https://gnews.io/api/v4/top-headlines?token=${apiKey}`;

    const fetchNews = async () => {
      try {
        const response = await axios.get(apiUrl);
        setNews(response.data.articles);
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };

    fetchNews();
  }, []);

  return (
    <div style={{ textAlign: 'center', margin: '20px' }}>
      <h2>Latest News</h2>
      <div>
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
    </div>
  );
};

export default NewsSection;
