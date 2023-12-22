import React from "react";


// We import all the components we need in our app

import LoginPage from "./components/loginPage";
import MainPage from "./components/mainPage";
import {useState} from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar';


function App() {
  const [user, setLoginUser] = useState({});

  return (
    <div className="App">
      <Navbar />
      <div style={{ margin: 20 }}>
        <Routes>
  
          <Route path="/login" element={<LoginPage setLoginUser={setLoginUser} />} />
          <Route path="/mainPage" element={<MainPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
