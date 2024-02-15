// Import necessary modules and functions
import express from "express";
import { db, bullsdb } from "../db/conn.mjs";
import * as tf from '@tensorflow/tfjs';
import { ObjectId } from "mongodb";
import fs from 'fs';
import fetch from 'node-fetch';
import writeModelFiles from "../functions/writeModelFiles.js";

const router = express.Router();
global.fetch = fetch;

// Define a function to make recommendations based on the loaded model
async function makeRecommendations(model, input) {
    try {
        // Make predictions using the loaded model
        const predictions = model.predict(input);

        // Process the predictions and return recommendations
        // Replace this with your actual recommendation logic
        return predictions;
    } catch (error) {
        throw new Error('Error making recommendations: ' + error.message);
    }
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
