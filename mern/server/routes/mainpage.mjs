// mainpage.mjs
import express from 'express';
import { bullsdb } from '../db/conn.mjs';
import cache from 'memory-cache';
import { connectToDatabaseMiddleware, closeDatabaseConnectionMiddleware, errorHandler, asyncMiddleware } from './middleware.mjs';
import searchRoute from './searchRoute.mjs';
import TickerData from '../models/tickerModels.js';

const router = express.Router();

// Use the search route
router.use('/api/search', searchRoute);


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



router.get("/", async (req, res) => {
    let collection = await bullsdb.collection("ticker_data");
    // Limit to 632 collections for faster loading process
    let results = await collection.find({}).limit(632).toArray(); 
    res.send(results).status(200);
});


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

// Combined route to fetch data
// Route to fetch paginated data
router.get('/api/data', connectToDatabaseMiddleware, cacheMiddleware(10), asyncMiddleware(async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;

        // Fetch paginated data
        const { data, totalPages } = await fetchDataFromDatabase(page, pageSize);

        // Add pagination headers
        addPaginationHeaders(res, req, page, pageSize, totalPages);

        res.json({ data, totalPages });
    } catch (err) {
        console.error('Error fetching data from MongoDB:', err);
        errorHandler(err, req, res);
    }
}));



export default router;
