import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AuthContext from "../components/AuthContext";
import BullsAiLogo from "../images/BullsAI logo_coloured_logo.png"; // Import BullsAI logo
import { Button, Select, MenuItem, Box, Avatar, Container, TextField, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';


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

      localStorage.setItem("userData", JSON.stringify(userData));

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

      window.alert("Registration successful");

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
        alert("Email is already registered. Please use another email.");
      } else {
        console.error("Registration failed:", error.message);
      }
    }
  };

  
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleForgotPassword = async () => {
    const email = prompt("Enter your email to reset password:");

    if (email) {
      try {
        await axios.post(`${process.env.REACT_APP_BASE_URL}/forget-password`, {
          email,
        });
        alert("Password reset initiated. Check your email for instructions.");
      } catch (error) {
        console.error("Password reset failed:", error.message);
        alert("Password reset failed. Please try again later.");
      }
    }
  };

  const submitButtonStyle = {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "15px 25px",
    border: "none",
    borderRadius: "15px",
    cursor: "pointer",
    marginBottom: "100px",
    fontSize: "18px",
  };

  const handleRegisterButton = () => {
    setActiveTab("register");
    navigate("/");
  };

  return (
    <Container maxWidth="sm">
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <Avatar
          alt="BullsAI Logo"
          src={BullsAiLogo}
          sx={{ width: 100, height: 100, margin: "0 auto 20px" }} // Styling for the logo
        />
        <div style={{ marginBottom: "20px" }}>
          <Button
            variant="contained"
            style={{
              marginRight: "10px",
              backgroundColor: activeTab === "login" ? "#28a745" : "#007bff",
              color: "white",
              fontSize: "18px",
            }}
            onClick={() => setActiveTab("login")}
          >
            Login
          </Button>
          <Button
            variant="contained"
            style={{
              backgroundColor: activeTab === "register" ? "#28a745" : "#007bff",
              color: "white",
              fontSize: "18px",
            }}
            onClick={() => setActiveTab("register")}
          >
            Register
          </Button>
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
      <Button type="submit" variant="contained" style={{ backgroundColor: '#4CAF50', marginRight: '10px' }}>
              Login
            </Button>
                <Button
          variant="text"
          color="primary"
          onClick={handleForgotPassword}
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
            {/* <Select
              value={registerAccountType}
              onChange={(e) => setRegisterAccountType(e.target.value)}
              fullWidth
              margin="normal"
            >
              <MenuItem value="Basic">Basic</MenuItem>
              <MenuItem value="Professional">Professional</MenuItem>
            </Select> */}
            <Box display="flex" justifyContent="center" mt={2}> {/* Align buttons in the center */}
              <Button type="submit" variant="contained" style={submitButtonStyle}>
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
      </div>
    </Container>
  );
};
export default LoginPage;
