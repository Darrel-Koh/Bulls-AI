// Import necessary modules and functions
import express from "express";
import { db, bullsdb } from "../db/conn.mjs";
import * as tf from '@tensorflow/tfjs';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

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
        const collection = bullsdb.collection('models');
        const doc = await collection.findOne({ symbol: req.params.ticker });

        // Check if model data exists
        if (!doc || !doc.model_json || !doc.model_weights) {
            res.status(404).send('No model found');
            return;
        }

        // Convert model JSON and weights data to TensorFlow.js model
        const modelJson = JSON.parse(doc.model_json.toString());

        // Extract the weights path from the model JSON
        const weightsPath = modelJson.weightsManifest[0].paths[0]; // Assuming the path is stored here

        // Resolve the weights path relative to the current directory
        const absoluteWeightsPath = path.resolve(__dirname, weightsPath);

        // Load the weight data from the file
        const weightData = fs.readFileSync(absoluteWeightsPath);

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

        // Send success response
        res.send({ status: 'success', message: 'Model loaded successfully' });
    } catch (error) {
        console.error('Error loading model:', error);
        res.status(500).send('Error loading model: ' + error.message);
    }
});

export default router;