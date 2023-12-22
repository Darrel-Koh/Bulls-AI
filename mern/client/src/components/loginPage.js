import React, { useState } from "react";
import "../components/style.css";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const LoginPage = ({ setLoginUser }) => {
  const [activeTab, setActiveTab] = useState("login");
  const navigate = useNavigate();

  const [user, setUser] = useState({
      name: '',
      email: '',
      password: '',
    });


  const handleChange = (e) => {
    const {name, value} = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const handleLogin = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    axios.post('http://localhost:5050/Login', user).then((res) => {
      alert(res.data.message);
      setLoginUser(res.data.user);
      console.log(user);
      navigate('/mainPage', { state: { user: res.data.user } });
    });
  };
  

  const handleRegister = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    const { name, email, password } = user;
    if (name && email && password) {
      axios.post('http://localhost:5050/Register', user).then((res) => console.log(res));
    } else {
      alert('Invalid input');
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
            <form
              style={{ maxWidth: "300px", margin: "auto" }}
            >
              <div style={{ marginBottom: "20px" }}>
                <label htmlFor="loginEmail">Email Address:</label>
                <input
                  type="text"
                  id="loginEmail"
                  name="email" 
                  value={user.email}  
                  onChange={handleChange}                  
                  style={{ width: "100%", padding: "8px" }}
                />
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label htmlFor="loginPassword">Password:</label>
                <input
                  type="password"
                  id="loginPassword"
                  name="password" 
                  value={user.password}  
                  onChange={handleChange}                  
                  style={{ width: "100%", padding: "8px" }}
                />
              </div>

              <div>
                <button type="submit" style={submitButtonStyle} onClick={handleLogin}>
                  Login
                </button>
              </div>
            </form>
          )}
          {activeTab === "register" && (
            <form
              style={{ maxWidth: "300px", margin: "auto" }}
            >
              <div style={{ marginBottom: "15px" }}>
                <label htmlFor="registerEmail">Email Address:</label>
                <input
                  type="text"
                  id="registerUsername"
                  name="email" 
                  value={user.email} 
                  onChange={handleChange}
                  style={{ width: "100%", padding: "8px" }}
                />
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label htmlFor="registerPassword">Password:</label>
                <input
                  type="password"
                  id="registerPassword"
                  name="password" 
                  value={user.password} 
                  onChange={handleChange}                
                  style={{ width: "100%", padding: "8px" }}
                />
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label htmlFor="registerFirstName">First Name:</label>
                <input
                  type="text"
                  id="registerFirstName"
                  name="name" 
                  value={user.name} 
                  onChange={handleChange}              
                  style={{ width: "100%", padding: "8px" }}
                />
              </div>
              <div>
                <button type="submit" style={submitButtonStyle} onClick={handleRegister}>
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
  fontSize: "18px",
};


export default LoginPage;
