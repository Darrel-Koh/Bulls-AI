import React, { useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from './AuthContext';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const AddTickerPage = ({ onAddTickerList, onCancel }) => {
  const [listName, setListName] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [errorOpen, setErrorOpen] = useState(false); // State for displaying error alert
  const [errorMessage, setErrorMessage] = useState(''); // State for error message
  const { userId } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleConfirm = async () => {
    try {
      if (listName.trim() !== '') {
        const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/add-tickerlist/${encodeURIComponent(userId)}`, {
          list_name: listName,
        });
        console.log('Response status:', response.status); // Log the response status  

        // Check if response status is 200 and has a message property
        if (response.status === 200 && response.data.message) {
          // Show success Snackbar
          setSnackbarMessage(response.data.message);
          setSnackbarOpen(true); // Open the Snackbar
          console.log('Snackbar open:', snackbarOpen); // Log the Snackbar open state
          
          // Reset listName after successful addition
          setListName('');
          
          // Optionally, navigate to another page
          setTimeout(() => {
            navigate('/my-ticker');
          }, 1000);
        }
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        // Display error message as Material-UI Alert
        setErrorMessage(error.response.data.error);
        setErrorOpen(true);
      } else {
        console.error('Error adding ticker list:', error.message);
      }
    }
  };
  

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    navigate('/my-ticker');
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false); // Close the Snackbar
  };

  const handleErrorClose = () => {
    setErrorOpen(false); // Close the Error Alert
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Add Ticker List
        </Typography>
        <TextField
          id="listName"
          label="List Name"
          variant="outlined"
          fullWidth
          value={listName}
          onChange={(e) => setListName(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button variant="contained" onClick={handleConfirm} sx={{ mr: 2 }}>
          Confirm
        </Button>
        <Button variant="contained" onClick={handleCancel}>
          Cancel
        </Button>
      </Box>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Snackbar open={errorOpen} autoHideDuration={6000} onClose={handleErrorClose}>
        <Alert onClose={handleErrorClose} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AddTickerPage;