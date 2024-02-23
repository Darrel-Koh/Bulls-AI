
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
    let query = {trading_name : req.params.tickername};
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

             // Fetch historical stock data from MongoDB or any other source
            // const historicalData = await fetchHistoricalData(tickerName);
            // Extract 'Adj Close' values from transactions
            // let adjCloseValues = result.transactions.map(transaction => transaction['Adj Close']);
            // console.log(adjCloseValues);

            // Filter transactions based on the date range
            let startDate = new Date('2000-01-01');
            let endDate = new Date();

            let filteredTransactions = result.transactions.filter(transaction => {
                let date = new Date(transaction.Date);
                return date >= startDate && date <= endDate;
            });

            console.log(filteredTransactions);

            // Usage:
            let wholeDataSet = createDataset(filteredTransactions);
            console.log(wholeDataSet.dataset); // This will print the dataset
            console.log(wholeDataSet.trainingDataLen); // This will print the length of the training data
            
            // Prepare the input data (assuming historicalData is an array of prices)
            // const input = preprocessInputData(historicalData);

            const model = await tf.loadLayersModel(tf.io.fromMemory(modelArtifacts));
            // model.summary();

             // Perform prediction
             // Assuming that `wholeDataSet.dataset` is your input data
            let inputData = wholeDataSet.dataset;

            // Reshape the data to have 60 time steps
            let reshapedData = [];
            for (let i = 59; i < inputData.length; i++) {
                let timeSteps = inputData.slice(i - 59, i + 1);
                reshapedData.push(timeSteps.map(value => [value]));
            }

            let tensorData = tf.tensor3d(reshapedData, [reshapedData.length, 60, 1]);

            // Perform prediction
            const prediction = model.predict(tensorData);

            // Handle the predictions as needed
            // For example, convert TensorFlow.js tensors to JavaScript arrays
            const predictionValues = await prediction.array();

            console.log(predictionValues);

            // // Handle the predictions as needed
            // // For example, convert TensorFlow.js tensors to JavaScript arrays
            // const predictionValues = await prediction.array();

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

function createDataset(data) {
    // Extract 'Adj Close' values from data
    let dataset = data.map(transaction => transaction['Adj Close']);

    // Calculate the length of the training data
    let trainingDataLen = Math.ceil(dataset.length * 0.95);

    return { dataset, trainingDataLen };
}

export default router;