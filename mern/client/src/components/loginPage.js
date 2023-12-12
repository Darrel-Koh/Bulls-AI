// LoginPage.js

import React, { useState } from 'react';

const LoginPage = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerFirstName, setRegisterFirstName] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    console.log('Logging in with:', loginUsername, loginPassword);
   
    setLoginUsername('');
    setLoginPassword('');
  };

  const handleRegister = (e) => {
    e.preventDefault();
    console.log('Registering with:', registerUsername, registerPassword, setRegisterFirstName);
   
    setRegisterUsername('');
    setRegisterPassword('');
    setRegisterFirstName('');
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: '20px' }}>
        <button
          style={{
            padding: '12px 20px',
            marginRight: '10px',
            backgroundColor: activeTab === 'login' ? '#28a745' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
          }}
          onClick={() => setActiveTab('login')}
        >
          Login
        </button>
        <button
          style={{
            padding: '12px 20px',
            backgroundColor: activeTab === 'register' ? '#28a745' : '#007bff',
            color: 'white',
            border: '1px solid #28a745',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
          }}
          onClick={() => setActiveTab('register')}
        >
          Register
        </button>
      </div>
      {activeTab === 'login' && (
        <form onSubmit={handleLogin} style={{ maxWidth: '300px', margin: 'auto' }}>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="loginUsername">Email Address:</label>
            <input
              type="text"
              id="loginUsername"
              value={loginUsername}
              onChange={(e) => setLoginUsername(e.target.value)}
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="loginPassword">Password:</label>
            <input
              type="password"
              id="loginPassword"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
          
          <div>
            <button type="submit" style={submitButtonStyle}>
              Login
            </button>
          </div>
        </form>
      )}
      {activeTab === 'register' && (
        <form onSubmit={handleRegister} style={{ maxWidth: '300px', margin: 'auto' }}>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="registerUsername">Email Address:</label>
            <input
              type="text"
              id="registerUsername"
              value={registerUsername}
              onChange={(e) => setRegisterUsername(e.target.value)}
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="registerPassword">Password:</label>
            <input
              type="password"
              id="registerPassword"
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="registerFirstName">First Name:</label>
            <input
              type="text"
              id="registerFirstName"
              value={registerFirstName}
              onChange={(e) => setRegisterFirstName(e.target.value)}
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
          <div>
            <button type="submit" style={submitButtonStyle}>
              Register
            </button>
          </div>
        </form>
      )}
      <footer style={{ marginTop: 'auto', padding: '10px', backgroundColor: '#f4f4f4' }}>
        <p>&copy; 2023 Bulls Ai. All rights reserved.</p>
      </footer>
    </div>
  );
};

const submitButtonStyle = {
  backgroundColor: '#4CAF50',
  color: 'white',
  padding: '10px 15px',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};


export default LoginPage;
