import express from 'express';
import { ObjectId } from 'mongodb';
import { bullsdb } from '../db/conn.mjs';

const router = express.Router();

router.get("/", async (req, res) => {
    let collection = await bullsdb.collection("recommendations");
    // Limit to 632 collections for faster loading process
    let results = await collection.find({}).toArray(); 
    res.send(results).status(200);
});

router.get('/recommendation-data', async (req, res) => {
    try {
        const recommendationCollection = bullsdb.collection("recommendations");
        const recommendations = await recommendationCollection.find({}).sort({ chng: -1 });
        res.json(recommendations);
    } catch (error) {
        console.error('Error fetching recommendations:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;
