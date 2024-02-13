import React, { useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from './AuthContext';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';

const AddTickerPage = ({ onAddTickerList, onCancel }) => {
  const [listName, setListName] = useState('');
  const { userId } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleConfirm = async () => {
    try {
      if (listName.trim() !== '') {
        const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/add-tickerlist/${encodeURIComponent(userId)}`, {
          list_name: listName,
        });
        navigate('/my-ticker');
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        alert(error.response.data.error);
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
    </Container>
  );
};

export default AddTickerPage;
