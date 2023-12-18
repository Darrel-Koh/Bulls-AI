import React from "react";

// We use Route in order to define the different routes of our application
import { Route, Routes } from "react-router-dom";

// We import all the components we need in our app
import Navbar from "./components/navbar";
import LoginPage from "./components/loginPage";
import MainPage from "./components/mainPage";
import ViewTickers from './components/viewTickers';
import NewsSection from './components/newsSection';

const App = () => {
  return (
    <div>
      <Navbar />
      <div style={{ margin: 20 }}>
      <Routes>
        <Route path="/loginPage" element={<LoginPage />} />
        <Route path="/mainPage" element={<MainPage />} />
        <Route path="/viewTickers" element={<ViewTickers />} />
        <Route path="/newsSection" element={<NewsSection />} />

      </Routes>
      </div>
    </div>
  );
};

export default App;
