//App.js
import React from "react";

// We use Route in order to define the different routes of our application
import { Route, Routes } from "react-router-dom";

// We import all the components we need in our app
// eslint-disable-next-line no-unused-vars
import Navbar from "./components/navbar";

// import Edit from "./components/edit";
import Edit from "./components/edit2";
// import Create from "./components/create";
import Header from "./components/header";
import GlossaryPage from "./components/Glossarypage";
import MyTickerPage from "./components/mytickerpage";
import AddTickerPage from "./components/addtickerpage";

import Create from "./components/create2";
import LoginPage from "./components/loginPage";
import MainPage from "./components/mainPage";
import UserList from "./components/recordList2";
import { useState } from 'react';
import AuthContext from './components/AuthContext';

const App = () => {
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState('');
  return (
    <div>
      <AuthContext.Provider value={{ userId, setUserId, userName, setUserName }}>
      <Header /> 
      <div style={{ margin: 20 }}>
      <Routes>
        <Route exact path="/" element={<LoginPage />} />
        <Route path="/edit/:id" element={<Edit />} />
        <Route path="/create" element={<Create />} />
        <Route path="/glossary" element={<GlossaryPage />} />
        {/* <Route path="/" element={<Header />} /> */}
        <Route path="/my-ticker" element={<MyTickerPage />} />
        <Route path="/add-ticker" element={<AddTickerPage />} />
        <Route path="/recordList" element={<UserList />} />
        <Route path="/mainPage" element={<MainPage />} />

      </Routes>
      
      </div>
      </AuthContext.Provider>
    </div>
  );
};

export default App;
