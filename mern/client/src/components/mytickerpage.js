import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const MyTickerPage = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await fetch(`http://localhost:5050/my-ticker`);

        if (!response.ok) {
          throw new Error(`Failed to fetch user data: ${response.statusText}`);
        }

        const userData = await response.json();
        setUsers(userData);
      } catch (error) {
        setError(error.message);
      }
    }

    fetchUserData();
  }, []);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  const handleListClick = (list) => {
    // Perform the desired action when a button inside the favlist is clicked
    console.log(`Button clicked inside favlist: ${list}`);
    // Add your logic to display the contents inside the favlist
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          {/* List Selection Boxes */}
          <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '20px' }}>
            {users.map((user) => (
              <ListSelectionBox
                key={user._id}
                user={user}
                label={user.first_name} // Displaying email, you can customize this based on your user structure
                selectedUser={selectedUser}
                onSelect={handleUserSelect}
              />
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div>
          <button onClick={() => handleListClick(selectedUser?.favlist)} style={actionButtonStyle}>
            Display Favlist
          </button>
          <Link to="/add-ticker" style={{ marginLeft: '10px' }}>
            <button style={actionButtonStyle}>Add Ticker List</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

const ListSelectionBox = ({ user, label, selectedUser, onSelect }) => {
  const isSelected = user._id === selectedUser?._id;
  const boxStyle = {
    padding: '10px',
    border: isSelected ? '2px solid #007bff' : '1px solid #ddd',
    cursor: 'pointer',
  };

  return (
    <div style={boxStyle} onClick={() => onSelect(user)}>
      {label}
    </div>
  );
};

const actionButtonStyle = {
  padding: '10px',
  marginLeft: '10px',
};

export default MyTickerPage;
