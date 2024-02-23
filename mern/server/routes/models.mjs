import express from "express";
import {db, bullsdb} from "../db/conn.mjs"
import { ObjectId } from "mongodb";
import fs from 'fs';
// import * as tf from '@tensorflow/tfjs-node';
import * as tf from '@tensorflow/tfjs';
import { exec } from 'child_process';
import fetch from 'node-fetch';
import writeModelFiles from "../functions/writeModelFiles.js";

const router = express.Router();
global.fetch = fetch;
// const writeModelFiles = require('../functions/writeModelFiles.js');


router.get('/:symbol', async (req, res) => {
    const collection = bullsdb.collection('plots');
    const doc = await collection.findOne({ symbol: req.params.symbol });
  
    if (doc && doc.plot_data) {
      try {
        const img = Buffer.from(doc.plot_data.buffer, 'binary');
        res.writeHead(200, {
          'Content-Type': 'image/png',
          'Content-Length': img.length
        });
        res.end(img);
      } catch (error) {
        console.error('Error converting image data:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    } else {
      console.log('Image document not found:', req.params.symbol);
      res.status(404).json({ message: 'Not found' });
    }
});

/* 

This route will be used to load the model in the browser.

1. Fetching the model data from the database.
2. Writing the model files to disk.
3. Checking if the model file exists.
4. Loading the model using TensorFlow.js.
5. Sending a response indicating that the model was loaded successfully. 

Next is predicting the price of a stock using the loaded model.

*/

router.get('/:ticker', async (req, res) => {
  console.log(req.params);  // Log the req.params object
  const collection = bullsdb.collection('models');
  const doc = await collection.findOne({ symbol: req.params.ticker });

  if (!doc || !doc.model_json || !doc.model_weights) {
    res.status(404).send('No model found');
    return;
  }

  const modelFiles = await writeModelFiles(req.params.ticker, doc);
  console.log(modelFiles);
  
   // Assuming you have a server that serves the model files at the following URL
   const modelPath = modelFiles.modelJsonPath;;
   const modelUrl = `http://localhost:5050/${modelFiles.modelJsonPath}`;
 
  // Check if the file exists
  try {
    await fs.promises.access(modelPath);
    console.log("Model file found");
  } catch (err) {
    res.status(404).send('Model file not found');
  }

  try {
    const model = await tf.loadLayersModel(modelUrl);
    model.summary();
    // Prepare input data

    // Get the model prediction
    // const prediction = model.predict(input);
    // console.log(prediction);
  
    res.send({ status: 'success', message: 'Model loaded and prediction made successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: 'error', message: error.message });
  }
});

export default router;