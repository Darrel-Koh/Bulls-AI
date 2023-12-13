// GlossaryPage.js
import React, { useState } from 'react';

const GlossaryPage = () => {
  const glossaryData = [
    { term: 'AI', definition: 'ARTIFICIAL INTELLIGENCE' },
    { term: 'IDE', definition: 'INTEGRATED DEVELOPMENT ENVIRONMENT (A SOFTWARE APPLICATION THAT HELPS PROGRAMMERS DEVELOP SOFTWARE CODE EFFICIENTLY)' },
    { term: 'VSCode', definition: 'VISUAL STUDIO CODE (AN INTEGRATED DEVELOPMENT ENVIRONMENT CREATED BY MICROSOFT)' },
    { term: 'GitHub', definition: 'IT IS A WEB-BASED PLATFORM AND VERSION CONTROL REPOSITORY' },
    // Add more terms and definitions as needed
  ];

  const [selectedTerm, setSelectedTerm] = useState(null);

  const handleTermClick = (term) => {
    setSelectedTerm(term);
  };

  return (
    <div style={containerStyle}>
      <div style={listStyle}>
        {/* Glossary List */}
        {glossaryData.map((item) => (
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
            <p>{glossaryData.find((item) => item.term === selectedTerm)?.definition}</p>
          </div>
        ) : (
          <p>Select a term to view its definition.</p>
        )}
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
