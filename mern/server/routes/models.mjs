// Import necessary modules and functions
import express from "express";
import { db, bullsdb } from "../db/conn.mjs";
import * as tf from '@tensorflow/tfjs';
import fs from 'fs';
import fetch from 'node-fetch';

const router = express.Router();
global.fetch = fetch;

// Function to write model files to disk
async function writeModelFiles(ticker, doc) {
    // Parse the model JSON
    const modelJson = JSON.parse(Buffer.from(doc.model_json.buffer, 'base64').toString());

    // Modify the paths value in the weightsManifest array
    modelJson.weightsManifest.forEach((manifestItem, index) => {
        manifestItem.paths = manifestItem.paths.map(() => `${ticker}_weights_${index}.bin`);
    });

    // Write the modified model JSON to a file
    const modelJsonPath = `./tfjs_model/${ticker}_model.json`;
    await fs.promises.writeFile(modelJsonPath, JSON.stringify(modelJson));

    // Write each weights data to a separate file
    await Promise.all(doc.model_weights.map((weightData, index) => {
        const weightPath = `./tfjs_model/${ticker}_weights_${index}.bin`;
        return fs.promises.writeFile(weightPath, weightData.buffer);
    }));

    return {
        modelJsonPath,
        weightsPaths: doc.model_weights.map((_, index) => `./tfjs_model/${ticker}_weights_${index}.bin`)
    };
}

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

        // Write model files to disk
        const modelFiles = await writeModelFiles(req.params.ticker, doc);

        // Load the model using TensorFlow.js
        const model = await tf.loadLayersModel(`http://localhost:5050/${modelFiles.modelJsonPath}`);

        // Print model summary
        model.summary();

        // Send success response
        res.send({ status: 'success', message: 'Model loaded successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error loading model');
    }
});

export default router;
