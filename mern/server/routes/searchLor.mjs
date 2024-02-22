
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

router.get("/:tickername", async (req, res) => {
    let collection = await bullsdb.collection("ticker_data");
    let query = {trading_name : req.params.tickername};
    let result = await collection.findOne(query);

    if (!result) {
        res.status(404).send("Not found");
    } else {
        try {
            if (!result.model_json || !result.model_weights) {
                res.status(404).send('No model found');
                return;
            }

            const modelJson = JSON.parse(result.model_json.toString());
            const weightData = result.model_weights.buffer;

            const modelArtifacts = {
                modelTopology: modelJson.modelTopology,
                weightSpecs: modelJson.weightsManifest[0].weights,
                weightData: weightData,
                format: modelJson.format,
                generatedBy: modelJson.generatedBy,
                convertedBy: modelJson.convertedBy
            };

            const model = await tf.loadLayersModel(tf.io.fromMemory(modelArtifacts));
            model.summary();
            result.status = 'success';
            result.message = 'Model loaded successfully';
            res.status(200).send(result);
            // res.status(200).send({ status: 'success', message: 'Model loaded successfully', data: result });
        } catch (error) {
            console.error('Error loading model:', error);
            res.status(500).send('Error loading model: ' + error.message);
        }
    }
});
// router.get("/:tickername", async (req, res) => {
//     let collection = await bullsdb.collection("ticker_data");
//     let query = {trading_name : req.params.tickername}; // Changed this line
//     let result = await collection.findOne(query);
  
//     if (!result) res.status(404).send("Not found"); // Changed this line
//     else res.status(200).send(result); // Changed this line
// });

export default router;