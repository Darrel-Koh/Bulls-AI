// Header.js
import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header style={headerStyle}>
      <Link to="/" style={{ ...logoStyle, marginRight: '10px' }}>
        Logo
      </Link>
      <nav style={navStyle}>
        <Link to="/glossary" style={{ ...buttonStyle, marginLeft: 0 }}>
          Glossary
        </Link>
        <Link to="/my-ticker" style={buttonStyle}>
          My Ticker
        </Link>
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
};

export default Header;
