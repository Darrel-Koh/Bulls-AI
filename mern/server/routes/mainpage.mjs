// Import necessary modules
import express from 'express';
import { bullsdb } from '../db/conn.mjs';
import cache from 'memory-cache';
import NodeCache from 'node-cache';

// Create an instance of express.Router
const router = express.Router();
const nodecache = new NodeCache();

// Middleware to cache responses
const cacheMiddleware = (duration) => {
    return (req, res, next) => {
      const key = `__express__${req.originalUrl || req.url}`;
      const cachedBody = cache.get(key);
      if (cachedBody) {
        return res.send(cachedBody);
      } else {
        res.sendResponse = res.send;
        res.send = (body) => {
          cache.put(key, body, duration * 1000);
          res.sendResponse(body);
        };
        next();
      }
    };
  };
  

// This section will help you get a list of all the glossary terms and desc records.
router.get("/", async (req, res) => {
    let collection = await bullsdb.collection("tickers");
    let results = await collection.find({}).toArray();
    res.send(results).status(200);
  });
  

  const ITEMS_PER_PAGE = 10; // Adjust as needed


// Route to fetch paginated and search data with caching
router.get('/api/data', cacheMiddleware(10), async (req, res) => {
    try {
      await bullsdb.connect();
  
      const page = parseInt(req.query.page, 10) || 1;
      const pageSize = parseInt(req.query.pageSize, 10) || 10;
      const skip = (page - 1) * pageSize;
  
      const database = bullsdb.db('bullsai');
      const collection = database.collection('ticker_data');
  
      const documents = await collection
        .find({})
        .skip(skip)
        .limit(pageSize)
        .toArray();
  
      res.json(documents);
    } catch (err) {
      console.error('Error fetching data from MongoDB:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } finally {
      await bullsdb.close();
    }
  });


router.get("/api/search", async (req, res) => {
    const { q: symbol } = req.query;

    // Check if the result is already in the cache
    const cachedResult = nodecache.get(symbol);
    if (cachedResult) {
        console.log('Cache hit:', symbol);
        return res.json(cachedResult);
    }

    try {
        await bullsdb.connect();
        const database = bullsdb.db('bullsai');
        const collection = database.collection('ticker_data');

        const documents = await collection.find({ symbol: symbol }).toArray();
        console.log('MongoDB Query:', { symbol: symbol });

        // Cache the result with a TTL (time-to-live) of 5 minutes (adjust as needed)
        nodecache.set(symbol, documents, 300);

        res.json(documents);
    } catch (err) {
        console.error('Error searching data from MongoDB:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await bullsdb.close();
    }
});


export default router;