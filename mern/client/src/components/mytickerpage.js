import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from './AuthContext'; // Import the AuthContext

const MyTickerPage = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedTab, setSelectedTab] = useState(null);
  const [error, setError] = useState(null);
  const { userId } = useContext(AuthContext); // Get userId from the context

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Use the userId from the context in the URL
        const response = await fetch(`http://localhost:5050/my-ticker/${encodeURIComponent(userId)}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch user data: ${response.statusText}`);
        }

        const userData = await response.json();
        setSelectedUser(userData);
        // Set the default selected tab to the first one
        if (userData.favList.length > 0) {
          setSelectedTab(userData.favList[0].list_name);
        }
      } catch (error) {
        setError(error.message);
      }
    };

    fetchUserData();
  }, [userId]); // Include userId in the dependency array

  const handleTabClick = (list_name) => {
    setSelectedTab(list_name);
  };

  const ListSelectionBox = ({ list, label, selectedTab, onSelect }) => {
    const isSelected = list === selectedTab;
    const boxStyle = {
      padding: '10px',
      border: isSelected ? '2px solid #007bff' : '1px solid #ddd',
      backgroundColor: isSelected ? '#f2f2f2' : '#fff',
      color: isSelected ? '#007bff' : '#000',
      cursor: 'pointer',
    };

    return (
      <div style={boxStyle} onClick={() => onSelect(list)}>
        {label}
      </div>
    );
  };

  const actionButtonStyle = {
    padding: '10px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    marginTop: '10px',
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

  const pageContainerStyle = {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
  };

  const tabsContainerStyle = {
    display: 'flex',
    justifyContent: 'flex-start',
    width: '100%',
    flexWrap: 'wrap',
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
  };

  return (
    <div style={pageContainerStyle}>
      <div style={tabsContainerStyle}>
        {selectedUser &&
          selectedUser.favList &&
          selectedUser.favList.map((list) => (
            <ListSelectionBox
              key={list.list_name}
              list={list.list_name}
              label={list.list_name}
              selectedTab={selectedTab}
              onSelect={handleTabClick}
            />
          ))}
      </div>

      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={tableHeaderStyle}>ID</th>
          </tr>
        </thead>
        <tbody>
          {selectedUser &&
            selectedUser.favList &&
            selectedUser.favList
              .filter((list) => selectedTab === null || list.list_name === selectedTab)
              .map((list) =>
                list.tickers.map((ticker, index) => (
                  <tr key={index}>
                    <td style={tableCellStyle}>{ticker}</td>
                  </tr>
                ))
              )}
        </tbody>
      </table>

      <button onClick={() => console.log('Add Ticker List')} style={actionButtonStyle}>
        Add Ticker List
      </button>
    </div>
  );
};

export default MyTickerPage;
