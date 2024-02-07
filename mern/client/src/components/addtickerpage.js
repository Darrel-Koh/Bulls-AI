import React, { useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from './AuthContext'; // Import the AuthContext
import { useNavigate } from 'react-router-dom';

const AddTickerPage = ({ onAddTickerList, onCancel }) => {
  const [listName, setListName] = useState('');
  const { userId } = useContext(AuthContext); // Get userId from the context
  const navigate = useNavigate();

  const handleConfirm = async () => {
    try {
      // Check if listName is not null or empty
      if (listName.trim() !== '') {
        // Make a request to add the ticker list
        const response = await axios.post(`http://localhost:5050/add-tickerlist/${encodeURIComponent(userId)}`, {
          list_name: listName,
        });
  
        // If the request is successful, navigate to the 'my-ticker' page
        navigate('/my-ticker');
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        // If the server returns a 409 error (List name already exists), display the error message
        alert(error.response.data.error);
      } else {
        // Handle other errors
        console.error('Error adding ticker list:', error.message);
      }
    }
  };
  

  const handleCancel = () => {
    // Call the parent component's function to handle cancellation
    if (onCancel) {
      onCancel();
    }
    navigate('/my-ticker');
  };

  return (
    <div>
      <h2>Add Ticker List</h2>
      <label htmlFor="listName">List Name:</label>
      <input
        type="text"
        id="listName"
        value={listName}
        onChange={(e) => setListName(e.target.value)}
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

export default AddTickerPage;
