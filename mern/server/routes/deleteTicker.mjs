// deleteTicker.mjs
import express from 'express';
import { bullsdb } from '../db/conn.mjs';
import { ObjectId } from 'mongodb';

const router = express.Router();

// Handler for deleting a single ticker
router.delete('/one/:id/:listName/:tickerId', async (req, res) => {
  const userId = req.params.id;
  const listName = req.params.listName;
  const tickerId = req.params.tickerId;

  console.log('Received userId:', userId);
  console.log('Received listName:', listName);
  console.log('Received tickerId:', tickerId);

  try {
    const usersCollection = await bullsdb.collection('users');
    const query = {
      _id: new ObjectId(userId),
      'favList.list_name': listName,
    };

    const update = {
      $pull: {
        'favList.$.tickers': tickerId,
      },
    };

    const result = await usersCollection.updateOne(query, update);

    if (result.matchedCount === 0) {
      res.status(404).json({ error: 'User, list, or ticker not found' });
      return;
    }

    res.status(200).json({ message: 'Ticker deleted successfully' });
  } catch (error) {
    console.error('Error deleting ticker:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Handler for deleting multiple tickers
router.delete('/multiple/:id/:listName', async (req, res) => {
  const userId = req.params.id;
  const listName = req.params.listName;
  const tickersToDelete = req.body.tickers; // Extract tickers from the request body

  console.log('Received userId:', userId);
  console.log('Received listName:', listName);
  console.log('Received tickersToDelete:', tickersToDelete);

  try {
    const usersCollection = await bullsdb.collection('users');
    const query = {
      _id: new ObjectId(userId),
      'favList.list_name': listName,
    };

    const update = {
      $pull: {
        'favList.$.tickers': { $in: tickersToDelete }, // Delete tickers that match the provided array
      },
    };

    const result = await usersCollection.updateOne(query, update);

    if (result.matchedCount === 0) {
      res.status(404).json({ error: 'User, list, or ticker not found' });
      return;
    }

    res.status(200).json({ message: 'Tickers deleted successfully' });
  } catch (error) {
    console.error('Error deleting tickers:', error);
    res.status(500).send('Internal Server Error');
  }
});

export default router;
