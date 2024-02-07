// mainpage.mjs
import express from 'express';
import { bullsdb } from '../db/conn.mjs';
import cache from 'memory-cache';
import { connectToDatabaseMiddleware, closeDatabaseConnectionMiddleware, errorHandler, asyncMiddleware } from './middleware.mjs';

const router = express.Router();

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

// Define a route handler to fetch data from the "ticker_data" collection
router.get("/", async (req, res) => {
    let collection = await bullsdb.collection("tickers_data");
    // Limit to 632 collections for faster loading process
    let results = await collection.find({}).limit(10).toArray(); 
    res.send(results).status(200);
});



router.get('/api/data', connectToDatabaseMiddleware, cacheMiddleware(10), asyncMiddleware(async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;

        // Fetch paginated data
        const { data, totalPages } = await fetchDataFromDatabase(page, pageSize);

        // Extract trading_name from each object in the data array
        const tradingNames = data.map(item => item.trading_name);

        // Add pagination headers
        addPaginationHeaders(res, req, page, pageSize, totalPages);

        res.json({ data: tradingNames, totalPages });
    } catch (err) {
        console.error('Error fetching data from MongoDB:', err);
        errorHandler(err, req, res);
    }
}));

export default router;
