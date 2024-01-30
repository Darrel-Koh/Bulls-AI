//mainPage.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const MainPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:5050/record/`);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `https://api.example.com/data?search=${searchTerm}`
      );
      setData(response.data);
    } catch (error) {
      console.error("Error searching data:", error);
    }
  };

  const submitButtonStyle = {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "10px 15px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginBottom: "100px",
    marginTop: "10px",
  };

  return (
    <div style={{ textAlign: "center", margin: "40px" }}>
      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <input
          type="text"
          placeholder="Search for Tickers/Stocks"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            textAlign: "center",
            padding: "8px",
            marginRight: "8px",
            width: "100%",
          }}
        />
        <button onClick={handleSearch} style={submitButtonStyle}>
          Search
        </button>
      </div>
      {data.length > 0 ? (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          {/* ... (existing code) */}
        </table>
      ) : (
        <p>No data available.</p>
      )}
      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Link to="/change-password" style={{ textDecoration: "none" }}>
          <button style={submitButtonStyle}>Change Password</button>
        </Link>
      </div>
    </div>
  );
};

export default MainPage;
