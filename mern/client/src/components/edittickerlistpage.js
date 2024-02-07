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

      // Make a request to check if the new list_name already exists
      const response = await axios.put(`http://localhost:5050/edit-tickerlist/${encodeURIComponent(userId)}/${encodeURIComponent(listName)}/${encodeURIComponent(newListName)}`);

      // Navigate back to MyTickerPage if the request is successful
      navigate('/my-ticker');
    } catch (error) {
      if (error.response && error.response.status === 409) {
        // If the server returns a 409 error (List name already exists), display the error message
        alert(error.response.data.error);
      } else {
        // Handle other errors
        console.error('Error editing ticker list:', error.message);
        alert(error.message); // Display error message
      }
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
