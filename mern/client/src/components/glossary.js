// Glossary.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Glossary = () => {
  const navigate = useNavigate();

  const handleGlossaryClick = () => {
    // Use the navigate function to navigate to the GlossaryPage
    navigate('/glossary');
  };

  return (
    <div>
      <button onClick={handleGlossaryClick}>Go to Glossary Page</button>
      {/* Add other content as needed */}
    </div>
  );
};

export default Glossary;
