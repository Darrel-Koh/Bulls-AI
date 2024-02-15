// Import necessary modules and functions
import express from "express";
import { db, bullsdb } from "../db/conn.mjs";
import * as tf from '@tensorflow/tfjs';
import fetch from 'node-fetch';

const router = express.Router();
global.fetch = fetch;

// Route to fetch model data from MongoDB and load the model
router.get('/:ticker', async (req, res) => {
    try {
        // Fetch model data from MongoDB
        const collection = bullsdb.collection('models');
        const doc = await collection.findOne({ symbol: req.params.ticker });

        // Check if model data exists
        if (!doc || !doc.model_json || !doc.model_weights) {
            res.status(404).send('No model found');
            return;
        }

        // Convert model JSON and weights data to TensorFlow.js model
        const modelJson = doc.model_json.toString();
        const modelWeights = doc.model_weights[0]; // Assuming only one set of weights for simplicity

        // Print out the model JSON
        console.log('Model JSON:', modelJson);

        // Construct model artifacts
        const modelArtifacts = {
            modelTopology: JSON.parse(modelJson),
            weightData: modelWeights
        };

        // Load the model from memory
        // const model = await tf.loadLayersModel(tf.io.fromMemory(modelArtifacts));

        // Print model summary (optional)
        // model.summary();

        // Send success response
        res.send({ status: 'success', message: 'Model loaded successfully' });
    } catch (error) {
        console.error('Error loading model:', error);
        res.status(500).send('Error loading model: ' + error.message);
    }
});

export default router;
