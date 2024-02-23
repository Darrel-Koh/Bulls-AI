
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
    // Retrieve input data from the request (e.g., stock ticker symbol)
    const tickerName = req.params.tickername;

    let collection = await bullsdb.collection("ticker_data");
    let query = { trading_name: req.params.tickername };
    let result = await collection.findOne(query); // store all values of the ticker in a variable result

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

            // Extract 'Adj Close' values from transactions
            let adjCloseValues = result.transactions.map(transaction => transaction['Adj Close']);
            
            // Create dataset
            let wholeDataSet = createDataset(adjCloseValues);
            let dataset = wholeDataSet.dataset;
            let trainingDataLen = wholeDataSet.trainingDataLen;

            // Prepare test data
            // let testData = createTestData(dataset, trainingDataLen);
            // Prepare test data
            let xTest = createTestData(dataset, trainingDataLen);
            console.log(xTest);

            // Perform prediction
            let predictions = model.predict(tf.tensor3d(xTest));
            let predictionValues = await predictions.array();


            // Return the predictions
            res.status(200).json({ predictions: predictionValues });
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

function createDataset(data) {
    // The data is already an array of 'Adj Close' values, so we don't need to extract them
    let dataset = data;

    // Calculate the length of the training data
    let trainingDataLen = Math.ceil(dataset.length * 0.95);

    return { dataset, trainingDataLen };
}


function createTestData(data, trainingDataLen) {
    let xTest = [];
    for (let i = trainingDataLen - 60; i < data.length; i++) {
        let tempData = [];
        for (let j = i; j < i + 60; j++) {
            tempData.push([data[j]]); // Wrap each data point in an array
        }
        xTest.push(tempData);
    }
    return xTest;
}



export default router;