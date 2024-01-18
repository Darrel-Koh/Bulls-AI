import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const MyTickerPage = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedTab, setSelectedTab] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:5050/my-ticker/${encodeURIComponent("65a923af650ef89cdf7928b8")}`);

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
  }, []);

  const handleTabClick = (list_name) => {
    setSelectedTab(list_name);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '20px' }}>
            {selectedUser &&
              selectedUser.favList &&
              selectedUser.favList.map((list) => (
                <ListSelectionBox
                  key={list.list_name}
                  list={list}
                  label={list.list_name}
                  selectedTab={selectedTab}
                  onTabClick={handleTabClick}
                />
              ))}
          </div>
        </div>

        <div>
          <Link to="/add-ticker" style={{ marginLeft: '10px' }}>
            <button style={actionButtonStyle}>Add Ticker List</button>
          </Link>
        </div>
      </div>

      {/* Display Content based on the selected tab */}
      {selectedUser &&
        selectedUser.favList &&
        selectedUser.favList.map((list) => (
          <div key={list.list_name} style={{ display: selectedTab === list.list_name ? 'block' : 'none' }}>
            <div>
              <p>ID:</p>
              <ul>
                {list.tickers.map((ticker, index) => (
                  <li key={index}>{ticker}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
    </div>
  );
};

const ListSelectionBox = ({ list, label, selectedTab, onTabClick }) => {
  const isSelected = list.list_name === selectedTab;
  const boxStyle = {
    padding: '10px',
    border: isSelected ? '2px solid #007bff' : '1px solid #ddd',
    cursor: 'pointer',
  };

  return (
    <div style={boxStyle} onClick={() => onTabClick(list.list_name)}>
      {label}
    </div>
  );
};

const actionButtonStyle = {
  padding: '10px',
  marginLeft: '10px',
};

export default MyTickerPage;
