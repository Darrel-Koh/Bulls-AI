import React, { useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from './AuthContext';
import { useNavigate, useParams } from 'react-router-dom';

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

      // Log user, old list name, and new list name
      console.log('User:', userId);
      console.log('Old List Name:', listName);
      console.log('New List Name:', newListName);

      // Make a request to check if the new list_name already exists
      const response = await axios.put(`http://localhost:5050/edit-tickerlist/${encodeURIComponent(userId)}/${encodeURIComponent(listName)}/${encodeURIComponent(newListName)}`);

      if (response.data.exists) {
        throw new Error('List Name already exists. Please choose a different name.');
      }

      // Navigate back to MyTickerPage
      navigate('/my-ticker');
    } catch (error) {
      console.error('Error editing ticker list:', error.message);

      // Display error message
      alert(error.message);
    }
  };

  const handleCancel = () => {
    // Navigate back to MyTickerPage
    navigate('/my-ticker');
  };

  return (
    <div>
      <h2>Edit Ticker List</h2>
      <label htmlFor="newListName">New List Name:</label>
      <input
        type="text"
        id="newListName"
        value={newListName}
        onChange={(e) => setNewListName(e.target.value)}
        style={{ width: '100%', padding: '8px' }}
      />

      <button onClick={handleConfirm} style={{ margin: '10px', padding: '10px' }}>
        Confirm
      </button>
      <button onClick={handleCancel} style={{ margin: '10px', padding: '10px' }}>
        Cancel
      </button>
    </div>
  );
};

export default EditTickerListPage;
