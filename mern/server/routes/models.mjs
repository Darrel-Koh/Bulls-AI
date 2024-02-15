// Import necessary modules and functions
import express from "express";
import { db, bullsdb } from "../db/conn.mjs";
import * as tf from '@tensorflow/tfjs';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

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
        const modelWeights = doc.model_weights[0]; // Assuming only one set of weights for simplicity

        // Print out the model JSON
        console.log('Model JSON:', modelJson);

        const modelConfig = modelJson.modelTopology.modelConfig;

        const fs = require('fs');
        const path = require('path');

        // Load the weight data from a file
        const weightData = fs.readFileSync(path.resolve(__dirname, 'path/to/your/weights/file'));

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
        
        
        // const model = await tf.models.modelFromJSON(modelConfig);
        // Verify model summary (optional)
        // model.summary();

        // Construct model artifacts
        // const modelArtifacts = {
        //     modelTopology: JSON.parse(modelJson),
        //     weightData: modelWeights
        // };

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
