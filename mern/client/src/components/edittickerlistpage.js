import React, { useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from './AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';

const EditTickerListPage = () => {
  const [newListName, setNewListName] = useState('');
  const { userId } = useContext(AuthContext);
  const navigate = useNavigate();
  const { listName } = useParams();

  const handleConfirm = async () => {
    try {
      if (newListName.trim() === '') {
        throw new Error('List Name cannot be empty');
      }

      const response = await axios.put(`${process.env.REACT_APP_BASE_URL}/edit-tickerlist/${encodeURIComponent(userId)}/${encodeURIComponent(listName)}/${encodeURIComponent(newListName)}`);
      navigate('/my-ticker');
    } catch (error) {
      if (error.response && error.response.status === 409) {
        alert(error.response.data.error);
      } else {
        console.error('Error editing ticker list:', error.message);
        alert(error.message);
      }
    }
  };

  const handleCancel = () => {
    navigate('/my-ticker');
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
    </Container>
  );
};

export default EditTickerListPage;
