import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../components/AuthContext';

const Header = () => {
  const authContext = useContext(AuthContext);
  const { userId, userName, setUserId, setUserName } = authContext || {};
  const navigate = useNavigate();

  const handleLogout = () => {
    // Ask for confirmation before logging out
    const confirmLogout = window.confirm('Are you sure you want to log out?');

    if (confirmLogout) {
      // Reset user ID and user name in the context
      setUserId(null);
      setUserName('');

      // Navigate to the login page after logout
      navigate('/login');
    }
  };

  return (
    <header style={headerStyle}>
      <Link to="/" style={{ ...logoStyle, marginRight: '10px' }}>
        Home
      </Link>
      <nav style={navStyle}>
        <Link to="/glossary" style={{ ...buttonStyle, marginLeft: 0 }}>
          Glossary
        </Link>
        <Link to="/my-ticker" style={buttonStyle}>
          My Ticker
        </Link>
        {userId ? (
          <span style={{ ...welcomeStyle, backgroundColor: '#28a745', pointerEvents: 'none' }}>
            Welcome, {userName}
          </span>
        ) : (
          <Link to="/login" style={buttonStyle}>
            Login
          </Link>
)}
        {userId && (
          <button onClick={handleLogout} style={{ ...buttonStyle, backgroundColor: '#dc3545' }}>
            Logout
          </button>
        )}
      </nav>
    </header>
  );
};


const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '10px',
  backgroundColor: '#333',
  color: '#fff',
};

const logoStyle = {
  textDecoration: 'none',
  color: '#fff',
  fontSize: '1.5rem',
};

const navStyle = {
  display: 'flex',
};

const buttonStyle = {
  textDecoration: 'none',
  color: '#fff',
  padding: '10px',
  fontWeight: 'bold',
  marginLeft: '20px', // Adjust the left margin as needed
  cursor: 'pointer',
};

const welcomeStyle = {
  ...buttonStyle,
  borderRadius: '8px', // Add rounded corners for distinction
};

export default Header;
