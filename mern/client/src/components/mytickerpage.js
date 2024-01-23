import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from './AuthContext'; // Import the AuthContext

const MyTickerPage = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedTab, setSelectedTab] = useState(null);
  const [error, setError] = useState(null);
  const { userId } = useContext(AuthContext); // Get userId from the context
  const [tickerData, setTickerData] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Ensure userId is available before making the API call
        if (!userId) {
          // Clear selectedUser and tickerData when userId is null
          setSelectedUser(null);
          setTickerData([]);
          return;
        }

        const response = await fetch(`http://localhost:5050/my-ticker/${encodeURIComponent(userId)}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch user data: ${response.statusText}`);
        }

        const userData = await response.json();
        setSelectedUser(userData);
        if (userData.favList.length > 0) {
          setSelectedTab(userData.favList[0].list_name);
        }

        // Fetch ticker data for each tickerId
        const tickerDataPromises = userData.favList
          .flatMap((list) => list.tickers)
          .map(async (tickerId) => {
            try {
              const tickerResponse = await fetch(`http://localhost:5050/my-ticker/ticker/${encodeURIComponent(tickerId)}`);
              if (!tickerResponse.ok) {
                throw new Error(`Failed to fetch ticker data: ${tickerResponse.statusText}`);
              }

              const tickerData = await tickerResponse.json();
              console.log('tickerData:', tickerData);
              return {
                tickerId,
                tickerData,
              };
            } catch (error) {
              console.error('Error fetching ticker data:', error);
              return null;
            }
          });

        // Wait for all ticker data promises to resolve
        const tickerDataResults = await Promise.all(tickerDataPromises);
        setTickerData(tickerDataResults.filter(Boolean)); // Filter out any null results
      } catch (error) {
        setError(error.message);
      }
    };

    fetchUserData();
  }, [userId]);

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

  // Ensure selectedUser is available before rendering
  if (!selectedUser) {
    return (
      <div style={pageContainerStyle}>
        <p>No user data available.</p>
      </div>
    );
  }

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
            <th style={tableHeaderStyle}>Trading Name</th>
            <th style={tableHeaderStyle}>Symbol</th>
          </tr>
        </thead>
        <tbody>
          {selectedUser &&
            selectedUser.favList &&
            selectedUser.favList
              .filter((list) => selectedTab === null || list.list_name === selectedTab)
              .map((list) =>
                list.tickers.map((tickerId, index) => {
                  const tickerInfo = tickerData.find((data) => data && data.tickerId === tickerId);

                  if (!tickerInfo) {
                    // Handle case where tickerData is not available yet
                    return null;
                  }

                  return (
                    <tr key={index}>
                      <td style={tableCellStyle}>{tickerId}</td>
                      <td style={tableCellStyle}>{tickerInfo.tickerData.trading_name}</td>
                      <td style={tableCellStyle}>{tickerInfo.tickerData.symbol}</td>
                    </tr>
                  );
                })
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
