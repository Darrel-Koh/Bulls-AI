import React, { useState, useEffect } from 'react';

export default function GlossaryPage() {
  const [terms, setTerms] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchGlossaryData() {
      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/glossary/`);

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
    <div>
      <div style={headerStyle}>
        <div style={headerBoxStyle}>
          <h1>Glossary</h1>
        </div>
      </div>
      <div style={containerStyle}>
        <div style={termsContainerStyle}>
          {terms.map((term) => (
            <div
              key={term.term}
              style={{ ...termBoxStyle, cursor: 'pointer' }}
              onClick={() => handleTermClick(term.term)}
            >
              {term.term}
            </div>
          ))}
        </div>
        <div style={contentContainerStyle}>
          {selectedTerm ? (
            <div style={contentBoxStyle}>
              <h2>{terms.find((item) => item.term === selectedTerm)?.name}</h2>
              <p>{terms.find((item) => item.term === selectedTerm)?.desc}</p>
            </div>
          ) : (
            <p>Select a term to view its definition.</p>
          )}
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
      </div>
    </div>
  );
}

const headerStyle = {
  textAlign: 'center',
};

const headerBoxStyle = {
  marginBottom: '20px',
  padding: '20px',
  borderRadius: '8px',
  backgroundColor: '#333',
  color: '#fff',
  border: '2px solid black', // Black outline
  transition: 'background-color 0.3s ease',
};

const containerStyle = {
  display: 'flex',
  fontFamily: 'Arial, sans-serif',
};

const termsContainerStyle = {
  marginRight: '20px',
};

const termBoxStyle = {
  marginBottom: '10px',
  padding: '10px',
  borderRadius: '8px',
  backgroundColor: '#f0f0f0',
  border: '2px solid black', // Black outline
  transition: 'background-color 0.3s ease',
};

const contentContainerStyle = {
  flex: 1,
};

const contentBoxStyle = {
  padding: '20px',
  borderRadius: '8px',
  backgroundColor: '#f0f0f0',
  border: '2px solid black', // Black outline
};

export {
  headerStyle,
  headerBoxStyle,
  containerStyle,
  termsContainerStyle,
  termBoxStyle,
  contentContainerStyle,
  contentBoxStyle,
};
