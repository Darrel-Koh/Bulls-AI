import React, { useState, useEffect } from 'react';

export default function GlossaryPage() {
  const [terms, setTerms] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchGlossaryData() {
      try {
        const response = await fetch(`http://localhost:5050/glossary/`);

        if (!response.ok) {
          throw new Error(`Failed to fetch glossary data: ${response.statusText}`);
        }

        const glossaryData = await response.json();
        setTerms(glossaryData);
      } catch (error) {
        setError(error.message);
      }
    }

    fetchGlossaryData();
  }, []);

  const handleTermClick = (displayedTerm) => {
    setSelectedTerm(displayedTerm);
  };

  return (
    <div style={containerStyle}>
      <div style={listStyle}>
        {terms.map((term) => (
          <div
            key={term.displayedTerm}
            style={{ ...termStyle, cursor: 'pointer' }}
            onClick={() => handleTermClick(term.term)}
          >
            {term.term}
          </div>
        ))}
      </div>
      <div style={contentStyle}>
        {selectedTerm ? (
          <div>
            <h2>{terms.find((item) => item.term === selectedTerm)?.name}</h2>
            <p>{terms.find((item) => item.term === selectedTerm)?.desc}</p>
          </div>
        ) : (
          <p>Select a term to view its definition.</p>
        )}
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    </div>
  );
}

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
