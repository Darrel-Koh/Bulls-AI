// server.mjs (Express backend)

import express from 'express';
import cors from 'cors';
import { MongoClient } from 'mongodb';

const app = express();
const port = 5050;

const uri = 'mongodb+srv://DarAdmin:strongpassword@bullscluster.9efqbnh.mongodb.net/Stocks';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
app.use(cors());

app.get('/api/test', (req, res) => {
  res.json({ message: 'This is a test endpoint' });
});

app.get('/api/data', async (req, res) => {
    try {
        await client.connect();
        const database = client.db('bullsai');
        const collection = database.collection('tickers');
        const documents = await collection.find({}).toArray();
        res.json(documents);
    } catch (err) {
        console.error('Error fetching data from MongoDB:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await client.close();
    }
});

//
//  uses a regular expression ($regex) to perform a case-insensitive search in MongoDB.
app.get('/api/search', async (req, res) => {
  const { q: symbol } = req.query; // Assuming the symbol is passed as 'q' query parameter

  try {
    await client.connect();
    const database = client.db('bullsai');
    const collection = database.collection('tickers');
    const documents = await collection.find({ symbol: { $regex: new RegExp(symbol, 'i') } }).toArray();

    res.json(documents);
  } catch (err) {
    console.error('Error searching data from MongoDB:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await client.close();
  }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
