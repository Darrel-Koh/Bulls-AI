import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AuthContext from './AuthContext';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle'
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const MyTickerPage = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedTab, setSelectedTab] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState(null);
  const [tickerData, setTickerData] = useState([]);
  const [selectedTickers, setSelectedTickers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { userId } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false); // State for confirmation dialog
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false); // State for Snackbar
  const [snackbarMessage, setSnackbarMessage] = useState(''); // Message for the Snackbar
  const [isDeleteSelectedConfirmationOpen, setIsDeleteSelectedConfirmationOpen] = useState(false); // State for delete selected confirmation dialog

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


    return list_name;
  };

  const handleDeleteTicker = async (listName, tickerId, tickerName) => {
    
    try {
      console.log('tickerData name:', tickerName);
      const confirmation = window.confirm(`Are you sure you want to delete the ticker "${tickerName}"?`);

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
    setIsDeleteSelectedConfirmationOpen(true); // Open delete selected confirmation dialog
  };

  const handleDeleteSelectedTickersConfirmed = async () => {
    try {
      setIsDeleteSelectedConfirmationOpen(false); // Close confirmation dialog

      if (selectedTickers.length === 0) {
        throw new Error('No tickers selected for deletion');
      }

      const response = await axios.delete(
        ` ${process.env.REACT_APP_BASE_URL}/delete-tickers/multiple/${encodeURIComponent(userId)}/${encodeURIComponent(selectedTab)}`,
        { data: { tickers: selectedTickers } }
      );

      if (!response.data) {
        throw new Error(`Failed to delete tickers: ${response.statusText}`);
      }

      // Call the fetchUserData function after the deletion
      fetchUserData();
      // Clear the selected tickers
      setSelectedTickers([]);
    } catch (error) {
      console.error('Error deleting tickers:', error.message);
    }
  };

  const handleDeselectAll = () => {
    setSelectedTickers([]);
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
 // eslint-disable-next-line no-unused-vars
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

      setIsConfirmationOpen(true); // Open confirmation dialog
    } catch (error) {
      console.error('Error deleting ticker list:', error.message);
    }
  };

  const handleConfirmationYes = async () => {
    try {
      setIsConfirmationOpen(false); // Close confirmation dialog

      const response = await axios.delete(`${process.env.REACT_APP_BASE_URL}/delete-tickerlist/${encodeURIComponent(userId)}/${encodeURIComponent(selectedTab)}`);

      if (!response.data) {
        throw new Error(`Failed to delete ticker list: ${response.statusText}`);
      }

      // Show Snackbar
      setIsSnackbarOpen(true);
      setSnackbarMessage(`Ticker list "${selectedTab}" successfully deleted.`);

      // Call the fetchUserData function after the deletion
      fetchUserData();
    } catch (error) {
      console.error('Error deleting ticker list:', error.message);
    }
  };

  const handleConfirmationNo = () => {
    setIsConfirmationOpen(false); // Close confirmation dialog
  };

  const handleEditListName = () => {
    // Check if a tab is selected
    if (!selectedTab) {
      alert('Please select a ticker list to edit.');
      return;
    }

    // Navigate to EditTickerListPage with the selectedTab as a parameter
    navigate(`/edit-tickerlist/${encodeURIComponent(selectedTab)}`);
  };

  const renderTabs = () => {
    if (!selectedUser || !selectedUser.favList) return null;
  
    const isBasicUser = selectedUser.account_type === 'Basic';
  
    if (isBasicUser) {
      return (
        <Box display="flex" justifyContent="flex-start" flexWrap="wrap">
          {selectedUser.favList.slice(0, 1).map((list) => (
            <Box
              key={list.list_name}
              mr={2}
              mb={2}
              onClick={() => handleTabClick(list.list_name)}
              style={{
                cursor: 'pointer',
                border:
                  selectedTab === list.list_name
                    ? '2px solid #007bff'
                    : '1px solid #ddd',
                padding: '10px',
                backgroundColor:
                  selectedTab === list.list_name ? '#f2f2f2' : '#fff',
                color: selectedTab === list.list_name ? '#007bff' : '#000',
              }}
            >
              {list.list_name}
            </Box>
          ))}
        </Box>
      );
    } else if (selectedUser.favList.length <= 5) {
      return (
        <Box display="flex" justifyContent="flex-start" flexWrap="wrap">
          {selectedUser.favList.map((list) => (
            <Box
              key={list.list_name}
              mr={2}
              mb={2}
              onClick={() => handleTabClick(list.list_name)}
              style={{
                cursor: 'pointer',
                border:
                  selectedTab === list.list_name
                    ? '2px solid #007bff'
                    : '1px solid #ddd',
                padding: '10px',
                backgroundColor:
                  selectedTab === list.list_name ? '#f2f2f2' : '#fff',
                color: selectedTab === list.list_name ? '#007bff' : '#000',
              }}
            >
              {list.list_name}
            </Box>
          ))}
        </Box>
      );
    } else {
      return (
        <FormControl>
          <InputLabel>Select List</InputLabel>
          <Select
            value={selectedTab || ''}
            onChange={(event) => setSelectedTab(event.target.value)}
          >
            {selectedUser.favList.map((list) => (
              <MenuItem key={list.list_name} value={list.list_name}>
                {list.list_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      );
    }
  };
  
  return (
    <Box mt={4}>
      <Typography variant="h4" gutterBottom>
        My Ticker Page
      </Typography>



      {renderTabs()}
      <Box sx={{ display: 'flex', gap: 1 }}>

      {!isLoading && selectedUser && selectedUser.favList && (
        selectedUser.favList
          .filter((list) => selectedTab === null || list.list_name === selectedTab)
          .every((list) => list.tickers.length === 0) ? (
            <div>
            No rows to display.
            <div>
              {/* Only show buttons for 'Professional' users */}
              {selectedUser && selectedUser.account_type === 'Professional' && (
                <>
                 <Button onClick={handleAddTickerClick} variant="contained" color="primary">
                  Add Ticker List
                </Button>
                <span style={{ margin: '0 5px' }}></span>
                <Button onClick={handleDeleteTickerList} variant="contained" color="error">
                  Delete List
                </Button>
                <span style={{ margin: '0 5px' }}></span>
                <Button onClick={handleEditListName} variant="contained" color="primary">
                  Edit List Name
                </Button>
                </>
              )}
            </div>
          </div>

        ) : (
          <div>
            <div>
              {/* Only show buttons for 'Professional' users */}
              {selectedUser && selectedUser.account_type === 'Professional' && (
                <>
                 <Button onClick={handleAddTickerClick} variant="contained" color="primary">
                  Add Ticker List
                </Button>
                <span style={{ margin: '0 5px' }}></span>
                <Button onClick={handleDeleteTickerList} variant="contained" color="error">
                  Delete List
                </Button>
                <span style={{ margin: '0 5px' }}></span>
                <Button onClick={handleEditListName} variant="contained" color="primary">
                  Edit List Name
                </Button>
                </>
              )}

            </div>
            
          </div>

        )
    )}
    </Box>
      <Box mt={4} display="flex" justifyContent="center">

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ padding: '10px', backgroundColor: '#f2f2f2', border: '1px solid #ddd' }}>Trading Name</th>
              <th style={{ padding: '10px', backgroundColor: '#f2f2f2', border: '1px solid #ddd' }}>Symbol</th>
              <th style={{ padding: '10px', backgroundColor: '#f2f2f2', border: '1px solid #ddd' }}>Latest Transaction Date</th>
              <th style={{ padding: '10px', backgroundColor: '#f2f2f2', border: '1px solid #ddd' }}>Latest Adj Close</th>
              <th style={{ padding: '10px', backgroundColor: '#f2f2f2', border: '1px solid #ddd' }}>Latest Volume</th>
              <th style={{ padding: '10px', backgroundColor: '#f2f2f2', border: '1px solid #ddd' }}>Actions</th>
              <th style={{ padding: '10px', backgroundColor: '#f2f2f2', border: '1px solid #ddd' }}>Select</th>
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
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{tickerInfo.tickerData.trading_name}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{tickerInfo.tickerData.symbol}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{latestTransaction.Date}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{latestTransaction['Adj Close']}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{latestTransaction.Volume}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                          <Button onClick={() => handleDeleteTicker(list.list_name, tickerId, tickerInfo.tickerData.trading_name)} variant="contained" color="error">
                            Delete
                          </Button>
                        </td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                          <Checkbox onChange={() => handleCheckboxChange(tickerId)} checked={selectedTickers.includes(tickerId)} />
                        </td>
                      </tr>
                    );
                    
                  })
                  
                )}
          </tbody>

          
          {isLoading && (
            <tr>
                <td colSpan="7" style={{ textAlign: 'center', marginTop: '10px', color: '#007bff' }}>
                    Loading...
                </td>
            </tr>
        )}
         
        </table>

      
      </Box>
      <Box mt={4} display="flex" justifyContent="space-between">
      <Box sx={{ display: 'flex', gap: 1 }}>
    
    <Button onClick={handleDeleteSelectedTickers} variant="contained" color="error">
      Delete Selected
    </Button>
    <Button onClick={handleDeselectAll} variant="contained" color="primary">
      Deselect All
    </Button>
  </Box>
</Box>


       
       
        <Dialog
        open={isConfirmationOpen}
        onClose={handleConfirmationNo}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete the ticker list "{selectedTab}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmationNo} color="primary">
            No
          </Button>
          <Button onClick={handleConfirmationYes} color="primary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={isDeleteSelectedConfirmationOpen}
        onClose={() => setIsDeleteSelectedConfirmationOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete the selected tickers?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteSelectedConfirmationOpen(false)} color="primary">
            No
          </Button>
          <Button onClick={handleDeleteSelectedTickersConfirmed} color="primary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={6000}
        onClose={() => setIsSnackbarOpen(false)}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={() => setIsSnackbarOpen(false)}
          severity="success"
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

export default MyTickerPage;