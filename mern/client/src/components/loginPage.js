import React, { useState } from "react";
import "../components/style.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerFirstName, setRegisterFirstName] = useState("");
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();

    console.log(`Email: ${loginEmail}, Password: ${loginPassword}`);
    if (!loginEmail || !loginPassword) {
      console.error("Email or password cannot be empty");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5050/login", {
        email: loginEmail,
        password: loginPassword,
      });

      console.log("Login successful. Response:", response.data);
      setLoggedIn(true);
      navigate("/mainPage");
    } catch (error) {
      console.error("Login failed:", error.message);
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:5050/register", {
        registerEmail,
        registerPassword,
        registerFirstName,
      });

      console.log("Registration successful");

      setRegisterEmail("");
      setRegisterPassword("");
      setRegisterFirstName("");
      setActiveTab("login");
    } catch (error) {
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data.startsWith("Password")
      ) {
        alert(error.response.data); // Show password requirements alert
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

  const handleForgotPassword = async () => {
    const email = prompt("Enter your email to reset password:");

    if (email) {
      try {
        await axios.post("http://localhost:5050/forget-password", {
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
                backgroundColor:
                  activeTab === "register" ? "#28a745" : "#007bff",
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
            <form onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
              <button type="submit">Login</button>
              <button type="button" onClick={handleForgotPassword}>
                Forgot Password?
              </button>
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

export default LoginPage;
