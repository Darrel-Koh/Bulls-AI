import React from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar";
import RecordList from "./components/recordList";
import Edit from "./components/edit2";
import Header from "./components/header";
import GlossaryPage from "./components/Glossarypage";
import MyTickerPage from "./components/mytickerpage";
import AddTickerPage from "./addtickerpage";
import Create from "./components/create2";
import LoginPage from "./components/loginPage";
import MainPage from "./components/mainPage";
import UserList from "./components/recordList2";
import ChangePassword from "./components/ChangePassword"; // Import the new ChangePassword component

const App = () => {
  return (
    <div>
      <Header />
      <Navbar />
      <div style={{ margin: 20 }}>
        <Routes>
          <Route path="/" element={<UserList />} />
          <Route path="/edit/:id" element={<Edit />} />
          <Route path="/create" element={<Create />} />
          <Route path="/glossary" element={<GlossaryPage />} />
          <Route path="/my-ticker" element={<MyTickerPage />} />
          <Route path="/add-ticker" element={<AddTickerPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/mainPage" element={<MainPage />} />
          <Route path="/change-password" element={<ChangePassword />} />{" "}
          {/* Add this line */}
        </Routes>
      </div>
    </div>
  );
};

export default App;
