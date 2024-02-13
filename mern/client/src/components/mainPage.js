// mainPage.js
//mainPage.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const MainPage = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState();

  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize]); // Update data when currentPage or pageSize changes

  const fetchData = async (page = currentPage, size = pageSize) => {
    try {
      setIsLoading(true);

      // Reset error message
      setErrorMessage("");

      // Fetch data from the /api/data endpoint
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/data?page=${page}&pageSize=${size}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const tickersData = await response.json();
      console.log("API Response:", tickersData); // Log the response for debugging

      // Assuming tickersData is an array of ticker objects
      setData(tickersData); // Update only the data for the current page
    } catch (error) {
      console.error("Error fetching data:", error);
      setErrorMessage("Error fetching data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    const trimmedSearchTerm = searchTerm.toString().trim();
    const encodedSearchTerm = encodeURIComponent(trimmedSearchTerm);

    if (!trimmedSearchTerm) {
      setErrorMessage("Please enter a search term.");
      return;
    }

    try {
      console.log("Sending request with search term:", encodedSearchTerm);

      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/search?q=${encodedSearchTerm}`
      );
      console.log("Response:", response);

      if (!response.ok) {
        console.error(
          "Search request failed:",
          response.status,
          response.statusText
        );
        return;
      }

      const searchData = await response.json();
      console.log("Search Data:", searchData);

      // Navigate to the ViewTickers page with search results and search term
      navigate("/viewTickers", {
        state: { searchResults: searchData, searchTerm: trimmedSearchTerm },
      });
    } catch (error) {
      console.error("Error searching data:", error);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage); // Update the state to trigger a re-render
  };

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const renderPagination = () => {
    if (totalPages > 1) {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            style={paginationButtonStyle}
          >
            &lt; Prev
          </button>
          {pageNumbers.map((pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => handlePageChange(pageNumber)}
              style={{
                ...paginationButtonStyle,
                backgroundColor:
                  currentPage === pageNumber ? "#321FDE" : "#fff",
                color: currentPage === pageNumber ? "#fff" : "#333",
              }}
            >
              {pageNumber}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            style={paginationButtonStyle}
          >
            Next &gt;
          </button>
        </div>
      );
    }
    return null;
  };

  const renderTable = () => {
    if (!data || data.length === 0) {
      return <p>No data available.</p>;
    }

    return (
      <div style={{ maxHeight: "700px", overflowY: "auto" }}>
        <table
          style={{
            width: "180%",
            borderCollapse: "collapse",
            marginTop: "20px",
            border: "1px solid #ddd",
          }}
        >
          <thead>
            <tr
              style={{ borderBottom: "2px solid #ddd", background: "#f2f2f2" }}
            >
              <th style={tableHeaderStyle}>Recommended for you</th>
              <th style={tableHeaderStyle}>Symbol</th>
              <th style={tableHeaderStyle}>Industries</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr
                key={index}
                style={{
                  borderBottom: "1px solid #ddd",
                  background: index % 2 === 0 ? "#f9f9f9" : "white",
                }}
              >
                <td style={tableCellStyle}>{item.trading_name}</td>
                <td style={tableCellStyle}>{item.symbol}</td>
                <td style={tableCellStyle}>{item.transaction_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div style={{ textAlign: "center", margin: "20px" }}>
      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <input
          type="text"
          placeholder="Search for Tickers/Stocks"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "12px",
            borderRadius: "5px",
            border: "1px solid #ddd",
            width: "60%",
            marginBottom: "12px",
            fontSize: "16px",
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: "12px",
            backgroundColor: "#321FDE",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            width: "60%",
            fontSize: "16px",
          }}
        >
          Search
        </button>
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        {isLoading ? (
          <p>Loading...</p>
        ) : data?.length > 0 ? (
          <>
            {renderTable()}
            {totalPages > 1 && renderPagination()}{" "}
            {/* Add this line for pagination */}
          </>
        ) : (
          <p>{errorMessage || "No data available."}</p>
        )}
      </div>

      <footer
        style={{
          marginTop: "300px",
          padding: "10px",
          backgroundColor: "#f4f4f4",
        }}
      >
        <p>&copy; 2023 Bulls Ai. All rights reserved.</p>
      </footer>
    </div>
  );
};

const tableHeaderStyle = {
  padding: "10px",
  textAlign: "center",
  fontWeight: "bold",
  border: "1px solid #ddd",
};

const tableCellStyle = {
  padding: "10px",
  textAlign: "center",
  border: "1px solid #ddd",
};

const paginationButtonStyle = {
  backgroundColor: "#321FDE",
  color: "white",
  padding: "10px 15px",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  margin: "0 5px",
};

export default MainPage;
