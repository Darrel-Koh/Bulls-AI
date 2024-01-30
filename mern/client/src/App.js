//App.js
import React from "react";
import { Route, Routes } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import Navbar from "./components/navbar";

import Edit from "./components/edit2";
import Header from "./components/header";
import GlossaryPage from "./components/Glossarypage";
import MyTickerPage from "./components/mytickerpage";
import AddTickerPage from "./components/addtickerpage";
import Create from "./components/create2";
import LoginPage from "./components/loginPage";
import MainPage from "./components/mainPage";
import UserList from "./components/recordList2";
import { useState } from "react";
import AuthContext from "./components/AuthContext";
import ChangePassword from "./components/ChangePassword"; // Import the new ChangePassword component

const App = () => {
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState("");
  return (
    <div>
      <AuthContext.Provider
        value={{ userId, setUserId, userName, setUserName }}
      >
        <Header />
        <div style={{ margin: 20 }}>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/edit/:id" element={<Edit />} />
            <Route path="/create" element={<Create />} />
            <Route path="/glossary" element={<GlossaryPage />} />
            <Route path="/my-ticker" element={<MyTickerPage />} />
            <Route path="/add-ticker" element={<AddTickerPage />} />
            <Route path="/recordList" element={<UserList />} />
            <Route path="/mainPage" element={<MainPage />} />
            <Route path="/change-password" element={<ChangePassword />} />{" "}
            {/* Add this line */}
          </Routes>
        </div>
      </AuthContext.Provider>
    </div>
  );
};

export default App;
