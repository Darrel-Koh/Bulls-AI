import React, { useState, useEffect } from 'react';

const GlossaryPage = () => {
  const [terms, setTerms] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGlossaryData = async () => {
      try {
        const response = await fetch('http://localhost:5050/glossary');
        if (!response.ok) {
          throw new Error(`Failed to fetch glossary data: ${response.statusText}`);
        }
        const data = await response.json();
        setTerms(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchGlossaryData();
  }, []); // Empty dependency array ensures this effect runs only once, equivalent to componentDidMount

  const handleTermClick = (term) => {
    setSelectedTerm(term);
  };

  return (
    <div style={containerStyle}>
      <div style={listStyle}>
        {/* Glossary List */}
        {terms.map((item) => (
          <div
            key={item.term}
            style={{ ...termStyle, cursor: 'pointer' }}
            onClick={() => handleTermClick(item.term)}
          >
            {item.term}
          </div>
        ))}
      </div>
      <div style={contentStyle}>
        {/* Display Selected Definition */}
        {selectedTerm ? (
          <div>
            <h2>{selectedTerm}</h2>
            <p>{terms.find((item) => item.term === selectedTerm)?.desc}</p>
          </div>
        ) : (
          <p>Select a term to view its definition.</p>
        )}

        {/* Display Error */}
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    </div>
  );
};

const containerStyle = {
  display: 'flex',
};

const listStyle = {
  marginRight: '20px',
};

const termStyle = {
  marginBottom: '10px',
};

const contentStyle = {
  flex: 1,
};

export default GlossaryPage;
