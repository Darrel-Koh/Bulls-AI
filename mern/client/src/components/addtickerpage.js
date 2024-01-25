import React, { useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from './AuthContext'; // Import the AuthContext

const AddTickerPage = ({ onAddTickerList, onCancel }) => {
  const [listName, setListName] = useState('');
  const { userId } = useContext(AuthContext); // Get userId from the context

  const handleConfirm = async () => {
    try {
      // Check if listName is not null or empty
      if (listName.trim() !== '') {
        // Make a request to add the ticker list
        const response = await axios.post(`http://localhost:5050/add-ticker/${encodeURIComponent(userId)}`, { list_name: listName });

        if (!response.data) {
          throw new Error(`Failed to add ticker list: ${response.statusText}`);
        }

        // Call the parent component's function to update the state
        onAddTickerList(response.data);
      }
    } catch (error) {
      console.error('Error adding ticker list:', error.message);
    }
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
      <button onClick={onCancel} style={{ margin: '10px', padding: '10px' }}>
        Cancel
      </button>
    </div>
  );
};

export default AddTickerPage;
