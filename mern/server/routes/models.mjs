// Import necessary modules and functions
import express from "express";
import { db, bullsdb } from "../db/conn.mjs";
import * as tf from '@tensorflow/tfjs';
import fetch from 'node-fetch';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();
global.fetch = fetch;

// Route to fetch model data from MongoDB and load the model
router.get('/:ticker', async (req, res) => {
    try {
        // Fetch model data from MongoDB
        const collection = bullsdb.collection('ticker_data');
        const doc = await collection.findOne({ symbol: req.params.ticker });

        // Check if model data exists
        if (!doc || !doc.model_json || !doc.model_weights) {
            res.status(404).send('No model found');
            return;
        }

        // Convert model JSON and weights data to TensorFlow.js model
        const modelJson = JSON.parse(doc.model_json.toString());

        // Use the weights data directly from MongoDB
        const weightData = doc.model_weights.buffer;

        // Construct model artifacts
        const modelArtifacts = {
            modelTopology: modelJson.modelTopology,
            weightSpecs: modelJson.weightsManifest[0].weights,
            weightData: weightData,
            format: modelJson.format,
            generatedBy: modelJson.generatedBy,
            convertedBy: modelJson.convertedBy
        };

        // Load the model from memory
        const model = await tf.loadLayersModel(tf.io.fromMemory(modelArtifacts));
        model.summary();

        // Send success response
        res.send({ status: 'success', message: 'Model loaded successfully' });
    } catch (error) {
        console.error('Error loading model:', error);
        res.status(500).send('Error loading model: ' + error.message);
    }
});

export default router;