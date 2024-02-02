import express from 'express';
import { bullsdb } from '../db/conn.mjs';
import NodeCache from 'node-cache';
import TickerData from '../models/tickerModels.js';
import { connectToDatabaseMiddleware, closeDatabaseConnectionMiddleware, errorHandler, asyncMiddleware } from './middleware.mjs';

const router = express.Router();
const nodecache = new NodeCache();

router.get("/", async (req, res) => {
    let collection = await bullsdb.collection("ticker_data");
    // Limit to 632 collections for faster loading process
    let results = await collection.find({}).limit(500).toArray(); 
    res.send(results).status(200);
});


router.get("/api/search", asyncMiddleware(async (req, res) => {
    const { q: searchQuery, page = 1, pageSize = 10 } = req.query;
    const skip = (page - 1) * pageSize;

    try {
        await bullsdb.connect();

        // Use Mongoose model for the TickerData
        const searchData = await TickerData.find({ trading_name: new RegExp(searchQuery, 'i') })
        .select('trading_name')
        .skip(skip)
        .limit(pageSize)
        .lean()
        .exec();
    // Check if there is a match in searchData
        if (searchData.length > 0) {
         console.debug('Search result found:', searchData);
         res.json(searchData[0]); // Return only the first match
         return; // Stop the search and return the result
}

        console.debug('MongoDB Query:', { trading_name: searchQuery });

        // Cache the result with a TTL (time-to-live) of 5 minutes (adjust as needed)
        nodecache.set(searchQuery, searchData, 1000);

        res.json(searchData);
    } catch (err) {
        console.error('Error searching data from MongoDB:', err);
        errorHandler(err, req, res);
    } finally {
        try {
            await bullsdb.close();
        } catch (closeErr) {
            console.error('Error closing database connection:', closeErr);
        }
    }
}));

export default router;