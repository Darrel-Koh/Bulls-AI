import express from 'express';
import { bullsdb } from '../db/conn.mjs';
import NodeCache from 'node-cache';
import TickerData from '../models/tickerModels.js';
import { connectToDatabaseMiddleware, closeDatabaseConnectionMiddleware, errorHandler, asyncMiddleware } from './middleware.mjs';

const router = express.Router();
const nodecache = new NodeCache();

router.get("/api/search", asyncMiddleware(async (req, res) => {
    const { q: searchQuery, page = 1, pageSize = 10 } = req.query;
    const skip = (page - 1) * pageSize;

    try {
        await bullsdb.connect();

        // Use Mongoose model for the TickerData
        const searchData = await TickerData.find({ trading_name: new RegExp(searchQuery, 'i') })
            .skip(skip)
            .limit(pageSize)
            .lean()  // Use lean() to get plain JavaScript objects instead of Mongoose documents
            .exec();

        // Check if there is a match in searchData
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
