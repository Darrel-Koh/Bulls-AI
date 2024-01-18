import React, { useState, useEffect } from 'react';

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

  const ListSelectionBox = ({ list, label, selectedTab, onSelect }) => {
    const isSelected = list === selectedTab;
    const boxStyle = {
      padding: '10px',
      outline: isSelected ? '2px solid #000' : 'none', // Black outline for selected, no outline for others
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
    marginLeft: '10px',
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
                  list={list.list_name}
                  label={list.list_name}
                  selectedTab={selectedTab}
                  onSelect={handleTabClick}
                />
              ))}
          </div>
        </div>

        <div>
          <button onClick={() => console.log('Add Ticker List')} style={actionButtonStyle}>
            Add Ticker List
          </button>
        </div>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
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
    </div>
  );
};

export default MyTickerPage;
