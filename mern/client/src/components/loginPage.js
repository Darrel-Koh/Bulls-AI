
import React, { useState } from "react";
import '../components/style.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const LoginPage = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerFirstName, setRegisterFirstName] = useState("");
  const navigate = useNavigate();
  const [setLoggedIn] = useState(false);


  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/login', { loginEmail, loginPassword });
      console.log('Login successful. Token:', response.data.token);

      // Set loggedIn state to true and redirect to the main page
      setLoggedIn(true);
      navigate('/mainPage');
    } catch (error) {
      console.error('Login failed:', error.message);
    }
  };

  const handleRegister = async () => {
    try {
      await axios.post('http://localhost:5000/register', { registerEmail, registerPassword, registerFirstName });
      console.log('Registration successful');
    } catch (error) {
      console.error('Registration failed:', error.message);
    }
  };

  return (

    <div className="parent-div">

    <div className="outer-div">

    <div
      style={{
        textAlign: "center",
        marginTop: "100px",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >

      <div style={{ marginBottom: "20px" }}>
        <button
          style={{
            padding: "12px 50px",
            marginTop: "140px",
            marginRight: "10px",
            backgroundColor: activeTab === "login" ? "#28a745" : "#007bff",
            color: "white",
            border: "2px",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "18px",
          }}
          onClick={() => setActiveTab("login")}
        >
          Login
        </button>
        <button
          style={{
            padding: "12px 40px",
            marginRight: "10px",
            backgroundColor: activeTab === "register" ? "#28a745" : "#007bff",
            color: "white",
            border: "2px",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "18px",
          }}
          onClick={() => setActiveTab("register")}
        >
          Register
        </button>

        
      </div>
      {activeTab === "login" && (
        <form
          onSubmit={handleLogin}
          style={{ maxWidth: "300px", margin: "auto" }}
        >
          <div style={{ marginBottom: "20px" }}>
            <label htmlFor="loginEmail">Email Address:</label>
            <input
              type="text"
              id="loginEmail"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              style={{ width: "100%", padding: "8px" }}
            />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label htmlFor="loginPassword">Password:</label>
            <input
              type="password"
              id="loginPassword"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              style={{ width: "100%", padding: "8px" }}
            />
          </div>

          <div>
            <button type="submit" style={submitButtonStyle}>
              Login
            </button>
          </div>
        </form>
      )}
      {activeTab === "register" && (
        <form
          onSubmit={handleRegister}
          style={{ maxWidth: "300px", margin: "auto" }}
        >
          <div style={{ marginBottom: "15px" }}>
            <label htmlFor="registerEmail">Email Address:</label>
            <input
              type="text"
              id="registerUsername"
              value={registerEmail}
              onChange={(e) => setRegisterEmail(e.target.value)}
              style={{ width: "100%", padding: "8px" }}
            />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label htmlFor="registerPassword">Password:</label>
            <input
              type="password"
              id="registerPassword"
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
              style={{ width: "100%", padding: "8px" }}
            />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label htmlFor="registerFirstName">First Name:</label>
            <input
              type="text"
              id="registerFirstName"
              value={registerFirstName}
              onChange={(e) => setRegisterFirstName(e.target.value)}
              style={{ width: "100%", padding: "8px" }}
            />
          </div>
          <div>
            <button type="submit" style={submitButtonStyle}>
              Register
            </button>
          </div>
        </form>
      )}
      <footer
        style={{
          marginTop: "auto",
          padding: "10px",
          backgroundColor: "#f4f4f4",
        }}
      >
        <p>&copy; 2023 Bulls Ai. All rights reserved.</p>
      </footer>
      </div>
      </div>
    </div>
  );
};

const submitButtonStyle = {
  backgroundColor: "#4CAF50",
  color: "white",
  padding: "15px 25px",
  border: "none",
  borderRadius: "15px",
  cursor: "pointer",
  marginBottom: "100px",
  fontSize: "18px"
};

export default LoginPage;
