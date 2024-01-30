import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const AddTickerPage = () => {
  const [tickers] = useState([
    { name: 'JKL Co', price: 95, technical: 'Declining', risk: 'High' },
    { name: 'MNO Corp', price: 105, technical: 'Strong', risk: 'Medium' },
    { name: 'PQR Ltd', price: 110, technical: 'Stable', risk: 'Low' },
    { name: 'STU Inc', price: 85, technical: 'Growing', risk: 'Medium' },
    { name: 'EFG Ltd', price: 120, technical: 'Growing', risk: 'High' },
    { name: 'LMN Co', price: 90, technical: 'Declining', risk: 'Medium' },
    { name: 'ABC Corp', price: 100, technical: 'Strong', risk: 'Low' },
    { name: 'XYZ Inc', price: 75, technical: 'Stable', risk: 'Medium' },
  ]);

  const [selectedTickers, setSelectedTickers] = useState([]);

  const handleTickerClick = (index) => {
    const isSelected = selectedTickers.includes(index);

    if (isSelected) {
      // If already selected, remove from the list
      setSelectedTickers((prevSelected) => prevSelected.filter((selected) => selected !== index));
    } else {
      // If not selected, add to the list
      setSelectedTickers((prevSelected) => [...prevSelected, index]);
    }
  };

  const handleAddClick = () => {
    // Implement the logic to add selected tickers
    console.log('Add selected tickers');
  };

  return (
    <div>
      <h3>Ticker List</h3>
      <div style={{ marginBottom: '10px' }}>
      <Link to="/my-ticker">
          <button style = {buttonStyle} onClick={handleAddClick}>Return</button>
        </Link>
      </div>
      <table className="table table-striped" style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Technical</th>
            <th>Risk</th>
          </tr>
        </thead>
        <tbody>
          {tickers.map((ticker, index) => (
            <tr
              key={index}
              onClick={() => handleTickerClick(index)}
              style={{ cursor: 'pointer', backgroundColor: selectedTickers.includes(index) ? 'lightblue' : 'white' }}
            >
              <td>{ticker.name}</td>
              <td>{ticker.price}</td>
              <td>{ticker.technical}</td>
              <td>{ticker.risk}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ textAlign: 'right' }}>
        <Link to="/my-ticker">
          <button style = {buttonStyle} onClick={handleAddClick}>Add</button>
        </Link>
      </div>
    </div>
  );
};
const buttonStyle = {
  padding: '10px',
  marginLeft: '10px',
};
export default AddTickerPage;
