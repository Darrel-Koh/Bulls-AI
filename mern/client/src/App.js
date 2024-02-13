// App.js
import React from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import Navbar from "./components/navbar";
import Edit from "./components/edit2";
import Header from "./components/header";
import GlossaryPage from "./components/Glossarypage";
import MyTickerPage from "./components/mytickerpage";
import AddTickerPage from "./components/addtickerpage";
import ViewTickers from "./components/viewTickers";
import Create from "./components/create2";
import LoginPage from "./components/loginPage";
import MainPage from "./components/mainPage";
import UserList from "./components/recordList2";
import { useState } from "react";
import AuthContext from "./components/AuthContext";
import ChangePassword from "./components/ChangePassword";
import ForgetPassword from "./components/ForgetPassword";

const App = () => {
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState("");

  return (
    <AuthContext.Provider value={{ userId, setUserId, userName, setUserName }}>
      {userId && <Header />}
      <div style={{ margin: 20 }}>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/edit/:id" element={<Edit />} />
          <Route path="/create" element={<Create />} />
          <Route path="/glossary" element={<GlossaryPage />} />
          <Route path="/my-ticker" element={<MyTickerPage />} />
          <Route path="/add-ticker" element={<AddTickerPage />} />
          <Route path="/recordListPage" element={<UserList />} />
          <Route path="/viewTickers" element={<ViewTickers />} />
          <Route path="/mainPage" element={<MainPage />} />
          <Route path="/changepassword" element={<ChangePassword />} />
          <Route
            path="/forget-password"
            element={<ForgetPassword userId={userId} />}
          />
          {/* Add a default route for unmatched paths */}
          <Route
            path="*"
            element={<Navigate to={userId ? "/mainPage" : "/"} replace />}
          />
        </Routes>
      </div>
    </AuthContext.Provider>
  );
};

export default App;
