// MyTickerPage.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const MyTickerPage = () => {
  const [selectedList, setSelectedList] = useState('popular');

  // Sample ticker data for different lists
  const tickerLists = {
    popular: [
      { name: 'ABC Corp', price: 100, technical: 'Strong', risk: 'Low' },
      { name: 'XYZ Inc', price: 75, technical: 'Stable', risk: 'Medium' },
    ],
    list1: [
      { name: 'EFG Ltd', price: 120, technical: 'Growing', risk: 'High' },
      { name: 'LMN Co', price: 90, technical: 'Declining', risk: 'Medium' },
    ],
    list2: [
      { name: 'PQR Ltd', price: 110, technical: 'Stable', risk: 'Low' },
      { name: 'STU Inc', price: 85, technical: 'Growing', risk: 'Medium' },
    ],
    list3: [
      { name: 'JKL Co', price: 95, technical: 'Declining', risk: 'High' },
      { name: 'MNO Corp', price: 105, technical: 'Strong', risk: 'Medium' },
    ],
  };

  const handleListSelect = (list) => {
    setSelectedList(list);
  };

  const handleDeleteList = () => {
    // Remove the selected list from the tickerLists object
    const updatedLists = { ...tickerLists };
    delete updatedLists[selectedList];
    setSelectedList(Object.keys(updatedLists)[0]); // Select the first list as the default
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ marginBottom: '10px' }}>
            <Link to="/add-ticker">Add Ticker List</Link>
          </div>
          {/* List Selection Boxes */}
          <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '20px' }}>
            {Object.keys(tickerLists).map((list) => (
              <ListSelectionBox
                key={list}
                list={list}
                label={list.charAt(0).toUpperCase() + list.slice(1)} // Capitalize the first letter
                selectedList={selectedList}
                onSelect={handleListSelect}
              />
            ))}
          </div>
        </div>

        {/* Delete List Button */}
        <button onClick={handleDeleteList} style={{ marginLeft: '10px' }}>
          Delete List
        </button>
      </div>

      {/* Ticker Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
        <thead>
          <tr>
            <th style={tableHeaderStyle}>Name</th>
            <th style={tableHeaderStyle}>Price</th>
            <th style={tableHeaderStyle}>Technical</th>
            <th style={tableHeaderStyle}>Risk</th>
          </tr>
        </thead>
        <tbody>
          {tickerLists[selectedList].map((ticker, index) => (
            <tr key={index}>
              <td style={tableCellStyle}>{ticker.name}</td>
              <td style={tableCellStyle}>{ticker.price}</td>
              <td style={tableCellStyle}>{ticker.technical}</td>
              <td style={tableCellStyle}>{ticker.risk}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const ListSelectionBox = ({ list, label, selectedList, onSelect }) => {
  const isSelected = list === selectedList;
  const boxStyle = {
    padding: '10px',
    border: isSelected ? '2px solid #007bff' : '1px solid #ddd',
    cursor: 'pointer',
  };

  return (
    <div style={boxStyle} onClick={() => onSelect(list)}>
      {label}
    </div>
  );
};

const tableHeaderStyle = {
  backgroundColor: '#f2f2f2',
  padding: '10px',
  border: '1px solid #ddd',
};

const tableCellStyle = {
  padding: '10px',
  border: '1px solid #ddd',
};

export default MyTickerPage;
