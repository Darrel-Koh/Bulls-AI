import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AuthContext from './AuthContext';

const MyTickerPage = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedTab, setSelectedTab] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState(null);
  const [tickerData, setTickerData] = useState([]);
  const { userId } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchUserData = async () => {
    try {
      if (!userId) {
        setSelectedUser(null);
        setTickerData([]);
        return;
      }

      const response = await axios.get(`http://localhost:5050/my-ticker/${encodeURIComponent(userId)}`);

      if (!response.data) {
        throw new Error(`Failed to fetch user data: ${response.statusText}`);
      }

      const userData = response.data;
      setSelectedUser(userData);

      if (userData.favList.length > 0) {
        setSelectedTab(userData.favList[0].list_name);
      }

      const tickerDataPromises = userData.favList
        .flatMap((list) => list.tickers)
        .map(async (tickerId) => {
          try {
            const tickerResponse = await axios.get(`http://localhost:5050/my-ticker/ticker/${encodeURIComponent(tickerId)}`);
            if (!tickerResponse.data) {
              throw new Error(`Failed to fetch ticker data: ${tickerResponse.statusText}`);
            }

            const tickerData = tickerResponse.data;
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

      const tickerDataResults = await Promise.all(tickerDataPromises);
      setTickerData(tickerDataResults.filter(Boolean));
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
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

  const handleAddTickerClick = () => {
    navigate('/add-ticker');
  };

  const handleDeleteTickerList = async () => {
    try {
      if (!selectedTab) {
        throw new Error('No ticker list selected for deletion');
      }

      const response = await axios.delete(`http://localhost:5050/delete-ticker/${encodeURIComponent(userId)}/${encodeURIComponent(selectedTab)}`);

      if (!response.data) {
        throw new Error(`Failed to delete ticker list: ${response.statusText}`);
      }

      // Call the fetchUserData function after the deletion
      fetchUserData();
    } catch (error) {
      console.error('Error deleting ticker list:', error.message);
    }
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

      <button onClick={handleAddTickerClick} style={actionButtonStyle}>
        Add Ticker List
      </button>
      <button onClick={handleDeleteTickerList} style={actionButtonStyle}>
        Delete List
      </button>
    </div>
  );
};

export default MyTickerPage;
