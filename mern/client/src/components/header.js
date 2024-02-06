import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../components/AuthContext';

const buttonStyle = {
  textDecoration: 'none',
  color: '#fff',
  padding: '10px',
  fontWeight: 'bold',
  cursor: 'pointer',
};

const redButtonStyle = {
  ...buttonStyle,
  backgroundColor: '#dc3545',
};

const roundedButtonStyle = {
  ...buttonStyle,
  borderRadius: '8px',
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
};

const dropdownStyle = {
  position: 'absolute',
  top: 'calc(100% + 10px)',
  right: 0,
  zIndex: '1',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#333',
};

const dropdownItemStyle = {
  ...buttonStyle,
  marginLeft: '0',
  borderRadius: '0',
};

const arrowStyle = {
  marginLeft: '5px',
  transform: 'rotate(180deg)',
  transition: 'transform 0.3s ease',
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

const Header = () => {
  const authContext = useContext(AuthContext);
  const { userId, userName, status, setUserId, setUserName, setStatus  } = authContext || {};
  const navigate = useNavigate();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [loading, setLoading] = useState(true); // New state for loading status
  const [isLoggedOut, setIsLoggedOut] = useState(false); // New state for logout status
  const dropdownRef = useRef(null);

  useEffect(() => {
    const checkAuthentication = async () => {
      const storedUserId = localStorage.getItem('userId');
      const storedUserName = localStorage.getItem('userName');
      const storedStatus = localStorage.getItem('status');

      if (storedUserId && storedUserName && storedStatus) {
        setUserId(storedUserId);
        setUserName(storedUserName);
        setStatus(storedStatus);
      }

      // Set loading to false once authentication check is complete
      setLoading(false);
    };

    checkAuthentication();
  }, [setUserId, setUserName, setStatus]);

  useEffect(() => {
    if (!userId && !loading) {
      // Navigate to default route only if not authenticated and loading is false
      navigate('/');
      setIsLoggedOut(true); // Set logout status to true
    } else {
      setIsLoggedOut(false); // Set logout status to false
    }
  }, [userId, loading, navigate]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [dropdownRef]);

  useEffect(() => {
    if (!userId) {
      setDropdownVisible(false);
    } else {
      localStorage.setItem('userId', userId);
      localStorage.setItem('userName', userName);
      localStorage.setItem('status', status);
    }
  }, [userId, userName, status]);

  const toggleDropdown = () => {
    setDropdownVisible((prevVisible) => !prevVisible);
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm('Are you sure you want to log out?');

    if (confirmLogout) {
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');
      localStorage.removeItem('status');

      setUserId(null);
      setUserName('');
      setStatus('');
      setDropdownVisible(false);

      navigate('/');
    }
  };

  const handleDropdownOptionClick = () => {
    setDropdownVisible(false);
  };

  if (loading || isLoggedOut) {
    // You can show a loading indicator or null during the initial loading phase or after logout
    return null;
  }

  return (
    <header style={headerStyle}>
      <Link to="/mainPage" style={{ ...logoStyle, marginRight: '20px' }}>
        Home
      </Link>
      <div style={navStyle}>
        <Link to="/glossary" style={{ ...buttonStyle, marginRight: '10px' }}>
          Glossary
        </Link>
        <div style={{ position: 'relative' }} ref={dropdownRef}>
          <span
            style={{ ...roundedButtonStyle, cursor: 'pointer', backgroundColor: '#28a745' }}
            onClick={toggleDropdown}
          >
            <span style={{ marginLeft: '5px' }}>Welcome, {userName}</span>
            <span style={{ ...arrowStyle, transform: dropdownVisible ? 'rotate(90deg)' : 'rotate(180deg)' }}>
              ➤
            </span>
          </span>
          {dropdownVisible && (
            <div style={{ ...dropdownStyle, width: '155px' }}>
              <Link to="/my-ticker" style={dropdownItemStyle} onClick={handleDropdownOptionClick}>
                My Ticker
              </Link>
              <button onClick={handleLogout} style={{ ...dropdownItemStyle, ...redButtonStyle }}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
