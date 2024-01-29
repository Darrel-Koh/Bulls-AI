import express from "express";
import {db, bullsdb} from "../db/conn.mjs"
import { ObjectId } from "mongodb";
import fs from 'fs';
// import * as tf from '@tensorflow/tfjs-node';
import * as tf from '@tensorflow/tfjs';
import { exec } from 'child_process';
import fetch from 'node-fetch';

const router = express.Router();
global.fetch = fetch;


router.get('/', async (req, res) => {
  const collection = bullsdb.collection('models');
  const docs = await collection.find().toArray();
  res.send(docs);
});

router.get('/:ticker', async (req, res) => {
  console.log(req.params);  // Log the req.params object
  const collection = bullsdb.collection('models');
  const doc = await collection.findOne({ symbol: req.params.ticker });

  if (!doc || !doc.model_json || !doc.model_weights) {
    res.status(404).send('No model found');
    return;
  }
   // Assuming you have a server that serves the model files at the following URL
   const modelPath = `./tfjs_model/${req.params.ticker}_model.json`;
   const modelUrl = `http://localhost:5050/tfjs_model/${req.params.ticker}_model.json`;
   
 
   // Check if the file exists
   if (!fs.existsSync(modelPath)) {
     res.status(404).send('Model file not found');
   } else{
      console.log("model file found");
   }
  // Assuming you have a server that serves the model files at the following URL
  // const modelUrl = `http://localhost:5050/mern/server/tfjs_models/${req.params.ticker}_model.json`;
  

  try {
    const model = await tf.loadLayersModel(modelUrl);
    res.send('Model loaded successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error loading model');
  }
});

// const model = await tf.loadLayersModel(`file://${modelJsonPath}`);
// });

export default router;