// glossarypage.js
import React, { useState, useEffect } from 'react';

const GlossaryPage = () => {
  const [terms, setTerms] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGlossaryData = async () => {
      try {
        const response = await fetch('http://localhost:3000/glossary');
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
  }, []); 

  const handleTermClick = (term) => {
    setSelectedTerm(term);
  };

  return (
    <div style={containerStyle}>
      <div style={listStyle}>
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
        {selectedTerm ? (
          <div>
            <h2>{selectedTerm}</h2>
            <p>{terms.find((item) => item.term === selectedTerm)?.desc}</p>
          </div>
        ) : (
          <p>Select a term to view its definition.</p>
        )}
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
