import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import AuthContext from '../components/AuthContext';
import BullsAiLogo from '../images/BullsAI logo_coloured_logo.png';
import {
  Typography,
  Button,
  Link,
  Menu,
  MenuItem,
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  ListItemIcon,
  ListItemText,
  Box, // Added Box component for wrapping elements
} from '@mui/material';
import { AccountCircle } from '@mui/icons-material';

const Header = () => {
  const authContext = useContext(AuthContext);
  const { userId, userName, status, setUserId, setUserName, setStatus } = authContext || {};
  const navigate = useNavigate();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [loading, setLoading] = useState(true); // New state for loading status
  const [isLoggedOut, setIsLoggedOut] = useState(false); // New state for logout status
  const dropdownRef = useRef(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);

  };

  const handleClose = () => {
    setAnchorEl(null);
  };


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
      localStorage.removeItem('userData');

      setUserId();
      setUserName('');
      setDropdownVisible(false);
      setStatus('');
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
    <AppBar position="static" style={{ background: 'black' }}>
    <Toolbar>
      <RouterLink to="/mainPage" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
        <Avatar alt="BullsAI Logo" src={BullsAiLogo} />
        <Typography variant="body1" style={{ marginLeft: '8px', fontFamily: 'helvetica, sans-serif', fontSize: '18px' }}>BULLS AI</Typography>
      </RouterLink>
      <div style={{ flexGrow: 1 }} />
      <Box display="flex" alignItems="center"> {/* Wrap elements in a Box */}
      <Button component={RouterLink} to="/my-ticker" color="inherit" style={{ marginRight: '10px' }}>
          Ticker List
        </Button>
        <Button component={RouterLink} to="/glossary" color="inherit" style={{ marginRight: '10px' }}>
          Glossary
        </Button>
        <Button component={RouterLink} to="/PricingPage" color="inherit" style={{ marginRight: '10px' }}>
          Upgrade Plan
        </Button>
        {userId ? (
          <div>
            <IconButton onClick={handleMenu} color="inherit">
              <AccountCircle />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              getContentAnchorEl={null}
            >
              {/* <MenuItem component={RouterLink} to="/my-ticker" onClick={handleClose}>
                My Ticker
              </MenuItem> */}
              <MenuItem component={RouterLink} to="/UserInfo" onClick={handleClose}>
                Profile
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <AccountCircle fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </MenuItem>
            </Menu>
          </div>
        ) : (
          <Button component={RouterLink} to="/login" color="inherit">
            Login
          </Button>
        )}
      </Box>
    </Toolbar>
  </AppBar>
);
};

export default Header;

