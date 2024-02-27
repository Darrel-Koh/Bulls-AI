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
import { useState, useEffect } from "react";
import AuthContext from "./components/AuthContext";
import ForgetPassword from "./components/ForgetPassword";
import EditTickerListPage from "./components/edittickerlistpage";
import ProfileUser from "./components/ProfileUser";
import PricingPage from "./components/PricingPage";
import UserInfo from "./components/UserInfo";
import PaymentPage from "./components/PaymentPage";
import UpdatePassword from "./components/updatePassword";

const App = () => {
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [status, setStatus] = useState("");

  // Check localStorage on component mount
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const storedUserName = localStorage.getItem("userName");
    const storedStatus = localStorage.getItem("status");

    if (storedUserId) {
      setUserId(storedUserId);
      setUserName(storedUserName);
      setStatus(storedStatus);
    }
  }, []);

  // Update localStorage when user info changes
  useEffect(() => {
    localStorage.setItem("userId", userId);
    localStorage.setItem("userName", userName);
    localStorage.setItem("status", status);
  }, [userId, userName, status]);

  return (
    <AuthContext.Provider
      value={{ userId, setUserId, userName, setUserName, status, setStatus }}
    >
      {userId && <Header />}
      <div style={{ margin: 20 }}>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/edit/:id" element={<Edit />} />
          <Route path="/create" element={<Create />} />
          <Route path="/glossary" element={<GlossaryPage />} />
          <Route path="/my-ticker" element={<MyTickerPage />} />
          <Route path="/add-ticker" element={<AddTickerPage />} />
          <Route
            path="/edit-tickerlist/:listName"
            element={<EditTickerListPage />}
          />
          {/* <Route path="/recordListPage" element={<UserList />} /> */}
          <Route path="/viewTickers" element={<ViewTickers />} />
          <Route path="/mainPage" element={<MainPage />} />
          <Route path="/ProfileUser" element={<ProfileUser />} />
          <Route path="/UserInfo" element={<UserInfo />} />
          <Route path="/PricingPage" element={<PricingPage />} />
          <Route path="/PaymentPage" element={<PaymentPage />} />
          <Route path="/updatePassword" element={<UpdatePassword />} />
          <Route
            path="/forget-password"
            element={<ForgetPassword userId="" />}
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
