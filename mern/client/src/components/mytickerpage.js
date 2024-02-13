import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AuthContext from './AuthContext';

const MyTickerPage = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedTab, setSelectedTab] = useState(null);
  const [error, setError] = useState(null);
  const [tickerData, setTickerData] = useState([]);
  const [selectedTickers, setSelectedTickers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { userId } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchUserData = useCallback(async () => {
    try {
      setIsLoading(true);

      if (!userId) {
        setSelectedUser(null);
        setTickerData([]);
        return;
      }
  
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/my-ticker/${encodeURIComponent(userId)}`);
  
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
            const tickerResponse = await axios.get(`${process.env.REACT_APP_BASE_URL}/my-ticker/ticker/${encodeURIComponent(tickerId)}`);
            if (!tickerResponse.data) {
              throw new Error(`Failed to fetch ticker data: ${tickerResponse.statusText}`);
            }

            const tickerData = tickerResponse.data;
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
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUserData();
  }, [userId, fetchUserData]);

  useEffect(() => {
    if (tickerData.length > 0) {
      setIsLoading(false);
    }
  }, [tickerData]);

  const handleTabClick = (list_name) => {
    setSelectedTab(list_name);
  };

  const modifyListNameForBasic = (list, index) => {
    if (selectedUser && selectedUser.account_type === 'Basic') {
      return index === 0 ? 'Default List' : list.list_name;
    }

    return list.list_name;
  };

  const handleDeleteTicker = async (listName, tickerId) => {
    try {
      const confirmation = window.confirm(`Are you sure you want to delete the ticker with ID ${tickerId}?`);

      if (!confirmation) {
        return;
      }

      const response = await axios.delete(
        `${process.env.REACT_APP_BASE_URL}/delete-tickers/one/${encodeURIComponent(userId)}/${encodeURIComponent(listName)}/${encodeURIComponent(tickerId)}`
      );

      if (!response.data) {
        throw new Error(`Failed to delete ticker: ${response.statusText}`);
      }

      fetchUserData();
    } catch (error) {
      console.error('Error deleting ticker:', error.message);
    }
  };

  const handleCheckboxChange = (tickerId) => {
    setSelectedTickers((prevSelected) => {
      if (prevSelected.includes(tickerId)) {
        return prevSelected.filter((id) => id !== tickerId);
      } else {
        return [...prevSelected, tickerId];
      }
    });
  };

  const handleDeleteSelectedTickers = async () => {
    try {
      if (selectedTickers.length === 0) {
        throw new Error('No tickers selected for deletion');
      }

      const confirmation = window.confirm(`Are you sure you want to delete the selected tickers?`);

      if (!confirmation) {
        return;
      }

      const response = await axios.delete(
        `${process.env.REACT_APP_BASE_URL}/delete-tickers/multiple/${encodeURIComponent(userId)}/${encodeURIComponent(
          selectedTab
        )}`,
        { data: { tickers: selectedTickers } }
      );

      if (!response.data) {
        throw new Error(`Failed to delete tickers: ${response.statusText}`);
      }

      fetchUserData();
      setSelectedTickers([]);
    } catch (error) {
      console.error('Error deleting tickers:', error.message);
    }
  };

  const handleDeselectAll = () => {
    setSelectedTickers([]);
  };

  const ListSelectionBox = ({ list, label, selectedTab, onSelect }) => {
    const isSelected = list === selectedTab;
    const isBasicUser = selectedUser && selectedUser.account_type === 'Basic';

    const boxStyle = {
      padding: '10px',
      border: isSelected ? '2px solid #007bff' : '1px solid #ddd',
      backgroundColor: isSelected ? '#f2f2f2' : '#fff',
      color: isSelected ? '#007bff' : '#000',
      cursor: 'pointer',
      display: isBasicUser ? (isSelected ? 'block' : 'none') : 'block',
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

  const tableContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  const buttonRowStyle = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: '10px',
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
  };
  const handleAddTickerClick = () => {
    navigate('/add-ticker');
  };
  
  const handleDeleteTickerList = async () => {
    try {
      if (!selectedTab) {
        throw new Error('No ticker list selected for deletion');
      }
  
      const confirmation = window.confirm(`Are you sure you want to delete the ticker list "${selectedTab}"?`);
  
      if (!confirmation) {
        return; // Do nothing if the user cancels the confirmation
      }

      const response = await axios.delete(`${process.env.REACT_APP_BASE_URL}/delete-tickerlist/${encodeURIComponent(userId)}/${encodeURIComponent(selectedTab)}`);

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
    <div style={containerStyle}>
      <div style={tabsContainerStyle}>
        {selectedUser &&
          selectedUser.favList &&
          selectedUser.favList.map((list, index) => (
            <ListSelectionBox
              key={list.list_name}
              list={list.list_name}
              label={modifyListNameForBasic(list, index)}
              selectedTab={selectedTab}
              onSelect={handleTabClick}
            />
          ))}
      </div>
  
      <div style={tableContainerStyle}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={tableHeaderStyle}>Trading Name</th>
              <th style={tableHeaderStyle}>Symbol</th>
              <th style={tableHeaderStyle}>Latest Transaction Date</th>
              <th style={tableHeaderStyle}>Latest Adj Close</th>
              <th style={tableHeaderStyle}>Latest Volume</th>
              <th style={tableHeaderStyle}>Actions</th>
              <th style={tableHeaderStyle}>Select</th>
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
  
                    // Find the latest transaction
                    const latestTransaction = tickerInfo.tickerData.transactions.reduce((latest, transaction) => {
                      return latest.Date > transaction.Date ? latest : transaction;
                    }, {});
  
                    return (
                      <tr key={index}>
                        <td style={tableCellStyle}>{tickerInfo.tickerData.trading_name}</td>
                        <td style={tableCellStyle}>{tickerInfo.tickerData.symbol}</td>
                        <td style={tableCellStyle}>{latestTransaction.Date}</td>
                        <td style={tableCellStyle}>{latestTransaction['Adj Close']}</td>
                        <td style={tableCellStyle}>{latestTransaction.Volume}</td>
                        <td style={tableCellStyle}>
                          <button
                            onClick={() => handleDeleteTicker(list.list_name, tickerId)}
                            style={{ backgroundColor: 'red', color: 'white' }}
                          >
                            Delete
                          </button>
                        </td>
                        <td style={tableCellStyle}>
                          <input
                            type="checkbox"
                            onChange={() => handleCheckboxChange(tickerId)}
                            checked={selectedTickers.includes(tickerId)}
                          />
                        </td>
                      </tr>
                    );
                  })
                )}
          </tbody>
        </table>
  
        {isLoading && (
          <div style={{ textAlign: 'center', marginTop: '10px', color: '#007bff' }}>
            Loading...
          </div>
        )}
  
  {!isLoading && selectedUser && selectedUser.favList && (
  selectedUser.favList
    .filter((list) => selectedTab === null || list.list_name === selectedTab)
    .every((list) => list.tickers.length === 0) ? (
      <div style={{ textAlign: 'center', marginTop: '10px', color: '#000' }}>
        No rows to display.
        <div style={buttonRowStyle}>
          <button onClick={handleAddTickerClick} style={actionButtonStyle}>
            Add Ticker List
          </button>
          {/* Add space between buttons */}
          <span style={{ margin: '0 10px' }}></span>
          <button onClick={handleDeleteTickerList} style={actionButtonStyle}>
            Delete List
          </button>
        </div>
      </div>
    ) : (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ ...buttonRowStyle, justifyContent: 'space-between' }}>
          {/* Only show buttons for 'Professional' users */}
          {selectedUser && selectedUser.account_type === 'Professional' && (
            <>
              <button onClick={handleAddTickerClick} style={actionButtonStyle}>
                Add Ticker List
              </button>
              <button onClick={handleDeleteTickerList} style={actionButtonStyle}>
                Delete List
              </button>
            </>
          )}
        </div>
        <div style={buttonRowStyle}>
          <div style={{ marginRight: '20px' }}>
            <button
              onClick={handleDeleteSelectedTickers}
              style={{ ...actionButtonStyle, backgroundColor: 'red' }}
            >
              Delete Selected
            </button>
          </div>
          <div>
            <button onClick={handleDeselectAll} style={actionButtonStyle}>
              Deselect All
            </button>
          </div>
        </div>
      </div>
    )
)}
      </div>
    </div>
  );
}
export default MyTickerPage;
