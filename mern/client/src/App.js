import React from "react";

// We use Route in order to define the different routes of our application
import { Route, Routes } from "react-router-dom";

// We import all the components we need in our app
import Navbar from "./components/navbar";
import RecordList from "./components/recordList";
import Edit from "./components/edit";
import Create from "./components/create";
import Header from "./components/header";
import GlossaryPage from "./components/Glossarypage";
import MyTickerPage from "./components/mytickerpage";
import AddTickerPage from "./addtickerpage";


const App = () => {
  return (
    <div>
      <Header />  {Header}
      <div style={{ margin: 20 }}>
      <Routes>
        <Route exact path="/" element={<RecordList />} />
        <Route path="/edit/:id" element={<Edit />} />
        <Route path="/create" element={<Create />} />
        <Route path="/glossary" element={<GlossaryPage />} />
        <Route path="/" element={<Header />} />
        <Route path="/my-ticker" element={<MyTickerPage />} />
        <Route path="/add-ticker" element={<AddTickerPage />} />
      </Routes>
      </div>
    </div>
  );
};

export default App;
