import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AuthContext from "../components/AuthContext";
import BullsAiLogo from "../images/BullsAI logo_coloured_logo.png"; // Import BullsAI logo
import { Button, Select, MenuItem, Box, Avatar, Container, TextField, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Tabs, Tab } from '@mui/material';
import { Snackbar } from '@mui/material';


const LoginPage = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerUsername, setRegisterUsername] = useState("");
  // const [registerAccountType, setRegisterAccountType] = useState("Basic");
  const navigate = useNavigate();
  const { setUserId, setUserName, setStatus } = useContext(AuthContext);
  const [wrongPasswordDialogOpen, setWrongPasswordDialogOpen] = useState(false); // State for dialog visibility
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState('');
  // Define state for the forgot password dialog
  const [email, setEmail] = useState("");
  const [open, setOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  const handleLogin = async (event) => {
    event.preventDefault();

    console.log(`Email: ${loginEmail}, Password: ${loginPassword}`);

    if (!loginEmail || !loginPassword) {
      console.error("Email or password cannot be empty");
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/login`, {
        email: loginEmail,
        password: loginPassword,
      });

      const userData = response.data;

      console.log("Login successful. Response:",userData);
      setUserId(response.data._id);
      setUserName(response.data.username);

      navigate("/mainPage");
    } catch (error) {
      console.error("Login failed:", error.message);
        // Show wrong password dialog
        setWrongPasswordDialogOpen(true); 
    }
  };

  const handleCloseWrongPasswordDialog = () => {
    setWrongPasswordDialogOpen(false);
};

  const handleRegister = async (event) => {
    event.preventDefault();

    try {
      if (!registerEmail || !registerPassword || !registerUsername) {
        throw new Error("Please fill in all the registration fields.");
      }

      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/register`, {
        registerEmail,
        registerPassword,
        registerUsername
        // registerAccountType,
      });

      setSnackbarMessage("Registration successful");
      setSnackbarOpen(true);

      setRegisterEmail("");
      setRegisterPassword("");
      setRegisterUsername("");
      // setRegisterAccountType("Basic");
      setActiveTab("login");
    } catch (error) {
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data.startsWith("Password")
      ) {
        setDialogContent(error.response.data);
        setOpenDialog(true);      
      } else if (
        error.response &&
        error.response.status === 400 &&
        error.response.data === "Email is already registered"
      ) {
        setSnackbarMessage('Email is already registered. Please use another email.');
        setSnackbarOpen(true);
      } else {
        console.error("Registration failed:", error.message);
      }
    }
  };

  const handleTabChange = (event, newTab) => {
    setActiveTab(newTab);
};

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleForgotPassword = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_BASE_URL}/forget-password`, {
        email,
      });
      setSnackbarMessage('Password reset initiated. Check your email for instructions.');
      setSnackbarOpen(true);    
    } catch (error) {
      console.error("Password reset failed:", error.message);
      setSnackbarMessage('Password reset failed. Please try again later.');
      setSnackbarOpen(true);
    }    
    handleCloseDialog();
  };

  const handleOpenResetDialog = () => {
    setOpen(true);
  };

  const handleCloseResetDialog = () => {
    setOpen(false);
  };



  return (
    <Container maxWidth="sm" style={{ textAlign: "center", marginTop: "100px" }}>
    <div style={{ textAlign: "center", marginTop: "100px" }}>
        <Avatar
          alt="BullsAI Logo"
          src={BullsAiLogo}
          sx={{ width: 100, height: 100, margin: "0 auto 20px" }} // Styling for the logo
        />
            <div style={{ marginBottom: "20px", display: "flex", justifyContent: "center" }}>
       <Tabs value={activeTab} onChange={handleTabChange} indicatorColor="primary">
                <Tab label="Login" value="login" />
                <Tab label="Register" value="register" />
            </Tabs>
        </div>

        {activeTab === "login" && (
          <form onSubmit={handleLogin}>
            <TextField
              type="email"
              placeholder="Email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              type="password"
              placeholder="Password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              fullWidth
              margin="normal"
            />
      <Button type="submit" variant="contained" style={{ backgroundColor: 'black', marginRight: '10px' }}>
              Login
            </Button>
                <Button
          variant="text"
          color="primary"
          onClick={handleOpenResetDialog}
          style={{ marginTop: "10px", marginLeft: "10px" }}
        >
          Forgot Password?
        </Button>
          </form>
        )}
        {activeTab === "register" && (
          <form onSubmit={handleRegister} style={{ maxWidth: "300px", margin: "auto" }}>
            <TextField
              type="text"
              label="Email Address"
              value={registerEmail}
              onChange={(e) => setRegisterEmail(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              type="password"
              label="Password"
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              type="text"
              label="Username"
              value={registerUsername}
              onChange={(e) => setRegisterUsername(e.target.value)}
              fullWidth
              margin="normal"
            />
        
            <Box display="flex" justifyContent="center" mt={2}> {/* Align buttons in the center */}
              <Button type="submit" variant="contained" style={{backgroundColor: "black"}}>
                Register
              </Button>
             
            </Box>
          </form>
        )}
           {/* Wrong Password Dialog */}
      <Dialog
        open={wrongPasswordDialogOpen}
        onClose={handleCloseWrongPasswordDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Wrong Password"}</DialogTitle>
        <DialogContent>
          <Typography variant="body1">Invalid email or password. Please try again.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseWrongPasswordDialog} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>

      {/* Registration Error Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Registration Error</DialogTitle>
        <DialogContent>
          <p>{dialogContent}</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>

       {/* Forgot Password Dialog */}
       <Dialog open={open} onClose={handleCloseResetDialog}>
        <DialogTitle>Reset Password</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Email Address"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseResetDialog} color="primary">Cancel</Button>
          <Button onClick={handleForgotPassword} color="primary">Reset Password</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
      open={snackbarOpen}
      autoHideDuration={6000} // Adjust the duration as needed
      onClose={() => setSnackbarOpen(false)}
      message={snackbarMessage}
    />
  

      </div>
    </Container>
  );
};
export default LoginPage;
