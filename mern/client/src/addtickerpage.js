// AddTickerPage.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const AddTickerPage = () => {
  const [tickerData, setTickerData] = useState({
    company: '',
    price: '',
    technical: '',
    risk: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTickerData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddTicker = () => {
    // Implement logic to add the new ticker to your lists
    console.log('Adding new ticker:', tickerData);
    // You can redirect to the MyTickerPage after adding the ticker
    navigate('/my-ticker');
  };

  const navigate = useNavigate();

  return (
    <div>
      <h1>Add Ticker Page</h1>
      <form>
        <label>
          Company:
          <input type="text" name="company" value={tickerData.company} onChange={handleChange} />
        </label>
        <br />
        <label>
          Price:
          <input type="text" name="price" value={tickerData.price} onChange={handleChange} />
        </label>
        <br />
        <label>
          Technical:
          <input type="text" name="technical" value={tickerData.technical} onChange={handleChange} />
        </label>
        <br />
        <label>
          Risk:
          <input type="text" name="risk" value={tickerData.risk} onChange={handleChange} />
        </label>
        <br />
        <button type="button" onClick={handleAddTicker}>
          Add Ticker
        </button>
      </form>
      <br />
      <Link to="/my-ticker">Go back to My Ticker Page</Link>
    </div>
  );
};

export default AddTickerPage;
