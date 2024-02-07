import express from 'express';
import { bullsdb } from '../db/conn.mjs';
import cache from 'memory-cache';
import { connectToDatabaseMiddleware, closeDatabaseConnectionMiddleware, errorHandler, asyncMiddleware } from './middleware.mjs';
import TickerData from '../models/tickerModels.js';

import NodeCache
 from 'node-cache';
const router = express.Router();
const nodecache = new NodeCache();

// router.get("/:key", async (req, res) => {
//     const page = parseInt(req.query.page) || 1; // Current page number, default: 1
//     const pageSize = parseInt(req.query.pageSize) || 10; // Number of items per page, default: 10

//     try {
//         console.log(req.params.key);
//         const searchTerm = req.params.key;

//         // Calculate the skip value based on the page number and page size
//         const skip = (page - 1) * pageSize;

//         // Build the aggregation pipeline
//         const pipeline = [
//             // Match documents based on the search term
//             {
//                 $match: {
//                     trading_name: { $regex: searchTerm, $options: 'i' } // Case-insensitive search
//                 }
//             },
//             // Skip documents based on pagination
//             { $skip: skip },
//             // Limit the number of documents returned per page
//             { $limit: pageSize }
//         ];

//         // Perform the aggregation query
//         const data = await TickerData.aggregate(pipeline);

//         res.json(data);
//     } catch (error) {
//         console.error('Error searching data:', error);
//         res.status(500).send('Internal Server Error');
//     }
// });

const fetchDataFromDatabase = async (page, pageSize) => {
    try {
        await bullsdb.connect();

        const skip = (page - 1) * pageSize;
        const database = bullsdb.db('bullsai');
        const collection = database.collection('ticker_data');

        // Fetch total count to calculate total pages
        const totalCount = await collection.countDocuments();
        const totalPages = Math.ceil(totalCount / pageSize);

        // Use bulk find operation to fetch documents with pagination
        const bulkFindOperations = [
            { $skip: skip },
            { $limit: Math.min(pageSize, 5) }, // Limit to 5 records or pageSize, whichever is smaller
        ];

        const documents = await collection.aggregate(bulkFindOperations).toArray();

        return { data: documents, totalPages };
    } catch (err) {
        console.error('Error fetching data from MongoDB:', err);
        throw new Error('Internal Server Error');
    } finally {
        await bullsdb.close();
    }
};

// Middleware for caching
const cacheMiddleware = (duration) => (req, res, next) => {
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

// Function to add pagination headers
const addPaginationHeaders = (res, req, page, pageSize, totalPages) => {
    const baseUrl = req.baseUrl;
    const currentUrl = `${baseUrl}?page=${page}&pageSize=${pageSize}`;

    res.links({
        next: `${currentUrl}&page=${page + 1}`,
        prev: `${currentUrl}&page=${page - 1}`,
        last: `${currentUrl}&page=${totalPages}`,
    });
};


router.get("/", async (req, res) => {
    let collection = await bullsdb.collection("ticker_data");
    // Limit to 632 collections for faster loading process
    let results = await collection.find({}).limit(300).toArray(); 
    res.send(results).status(200);
});


router.get("/api/search", asyncMiddleware(async (req, res) => {
    const { q: searchQuery, page = 1, pageSize = 10 } = req.query;
    const skip = (page - 1) * pageSize;

    try {
        // Connect to the database
        await bullsdb.connect();

        // Use Mongoose model for the TickerData
        const searchData = await TickerData.find(
            { $text: { $search: searchQuery } },
            { score: { $meta: 'textScore' } } // Optionally, you can also sort by relevance score
        )
        .skip(skip)
        .limit(pageSize)
        .sort({ score: { $meta: 'textScore' } })
        .lean()
        .exec();
        

        // Cache the result with a TTL (time-to-live) of 5 minutes (adjust as needed)
        nodecache.set(searchQuery, searchData, 300); // 300 seconds = 5 minutes

        // Return search results
        res.json(searchData);
    } catch (err) {
        console.error('Error searching data from MongoDB:', err);
        errorHandler(err, req, res);
    } finally {
        // Close the database connection
        await bullsdb.close();
    }
}));

// // Endpoint to search by trading_name
// router.get('/api/search', async (req, res) => {
//     const { q: searchQuery } = req.query;
//     try {
//         const searchData = await TickerData.find({ trading_name: new RegExp(searchQuery, 'i') }).select('trading_name');
//         res.json(searchData);
//     } catch (error) {
//         console.error('Error searching by trading_name:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

export default router;