// MyTicker.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MyTicker = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Automatically navigate to MyTickerPage when the component mounts
    navigate('/my-ticker');
  }, [navigate]);

  return (
    <div>
      <h1>My Ticker Component</h1>
      {/* Add other content as needed */}
    </div>
  );
};

export default MyTicker;
