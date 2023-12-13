// viewTickers.js



import React, { useState, useEffect } from 'react';
import axios from 'axios';


const ViewTickers = ({ location }) => {
  const stockData = location?.state?.stockData;

  if (!stockData) {
    // Redirect to the search page if there is no stock data
    // You can handle this case based on your requirements
    return null;
  }

  return (
    <div style={{ textAlign: 'center', margin: '20px' }}>
      <h1>Stock Information</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ddd' }}>
            <th style={{ padding: '10px', textAlign: 'left' }}>Attribute</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: '1px solid #ddd' }}>
            <td style={{ padding: '10px' }}>Symbol</td>
            <td style={{ padding: '10px' }}>{stockData.symbol}</td>
          </tr>
          <tr style={{ borderBottom: '1px solid #ddd' }}>
            <td style={{ padding: '10px' }}>Company Name</td>
            <td style={{ padding: '10px' }}>{stockData.companyName}</td>
          </tr>
          <tr style={{ borderBottom: '1px solid #ddd' }}>
            <td style={{ padding: '10px' }}>Price</td>
            <td style={{ padding: '10px' }}>{stockData.price}</td>
          </tr>
          {/* Add more rows based on your stock data structure */}
        </tbody>
      </table>
    </div>
  );
};

export default ViewTickers;

