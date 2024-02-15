import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import AuthContext from './AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const EditTickerListPage = () => {
  const [newListName, setNewListName] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [errorOpen, setErrorOpen] = useState(false); 
  const [errorMessage, setErrorMessage] = useState(''); 
  const { userId } = useContext(AuthContext);
  const navigate = useNavigate();
  const { listName } = useParams();

  useEffect(() => {
    // Set the initial value of newListName to the current list name
    setNewListName(listName);
  }, [listName]); // Trigger effect whenever listName changes

  const handleConfirm = async () => {
    try {
      if (newListName.trim() === '') {
        throw new Error('List Name cannot be empty');
      }

      const response = await axios.put(`${process.env.REACT_APP_BASE_URL}/edit-tickerlist/${encodeURIComponent(userId)}/${encodeURIComponent(listName)}/${encodeURIComponent(newListName)}`);
      
      // Show success Snackbar
      setSnackbarMessage('Ticker list edited successfully');
      setSnackbarOpen(true);

      // Navigate after a short delay to allow Snackbar to display
      setTimeout(() => {
        navigate('/my-ticker');
      }, 2000); // Adjust the delay time as needed
    } catch (error) {
      if (error.response && error.response.status === 409) {
        // Display error message as Material-UI Alert
        setErrorMessage(error.response.data.error);
        setErrorOpen(true);
      } else {
        console.error('Error editing ticker list:', error.message);
        // Show error alert
        alert(error.message);
      }
    }
  };

  const handleCancel = () => {
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
          Edit Ticker List
        </Typography>
        <TextField
          id="newListName"
          label="New List Name"
          variant="outlined"
          fullWidth
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
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

export default EditTickerListPage;
