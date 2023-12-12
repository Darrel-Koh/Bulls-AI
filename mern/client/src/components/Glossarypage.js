// GlossaryPage.js
import React from 'react';

const GlossaryPage = () => {
  return (
    <div>
      <h1>Glossary</h1>
      <div style={contentStyle}>
        <TermDefinition term="AI" definition="ARTIFICIAL INTELLIGENCE" />
        <TermDefinition
          term="IDE"
          definition="INTEGRATED DEVELOPMENT ENVIRONMENT (A SOFTWARE APPLICATION THAT HELPS PROGRAMMERS DEVELOP SOFTWARE CODE EFFICIENTLY)"
        />
        <TermDefinition
          term="VSCode"
          definition="VISUAL STUDIO CODE (AN INTEGRATED DEVELOPMENT ENVIRONMENT CREATED BY MICROSOFT)"
        />
        <TermDefinition
          term="GitHub"
          definition="IT IS A WEB-BASED PLATFORM AND VERSION CONTROL REPOSITORY"
        />
        {/* Add more terms and definitions as needed */}
      </div>
    </div>
  );
};

const contentStyle = {
  padding: '20px',
};

const TermDefinition = ({ term, definition }) => (
  <div style={termStyle}>
    <strong>{term}</strong>: {definition}
  </div>
);

const termStyle = {
  marginBottom: '15px',
};

export default GlossaryPage;
