// Import necessary modules
import express from 'express';
import { bullsdb } from '../db/conn.mjs';

// Create an instance of express.Router
const router = express.Router();

// This section will help you get a list of all the glossary terms and desc records.
router.get("/", async (req, res) => {
    let collection = await bullsdb.collection("tickers");
    let results = await collection.find({}).toArray();
    res.send(results).status(200);
  });
  

// Route to fetch all data
router.get('/api/data', async (req, res) => {
  try {
    // Connect to MongoDB
    await bullsdb.connect();

    // Fetch data from the 'tickers' collection
    const database = bullsdb.db('bullsai');
    const collection = database.collection('tickers');
    const documents = await collection.find({}).toArray();
    console.log('Fetched data from MongoDB:', documents);

    // Send the fetched data as JSON
    res.json(documents);
  } catch (err) {
    // Handle errors
    console.error('Error fetching data from MongoDB:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    // Close the MongoDB connection
    await bullsdb.close();
  }
});


router.get("/api/search", async (req, res) => {
    const { q: symbol } = req.query;
    console.log('Received symbol:', symbol);

    try {
      await bullsdb.connect();
      const database = bullsdb.db('bullsai');
      const collection = database.collection('tickers');
      
      const documents = await collection.find({ symbol: symbol }).toArray();
      console.log('MongoDB Query:', { symbol: symbol });

      res.json(documents);
    } catch (err) {
      console.error('Error searching data from MongoDB:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } finally {
      await bullsdb.close();
    }
});


export default router;