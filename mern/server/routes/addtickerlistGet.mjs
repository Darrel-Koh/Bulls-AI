// addtickerlistGet.mjs
import express from 'express';
import { bullsdb } from '../db/conn.mjs';
import { ObjectId } from 'mongodb';

const router = express.Router();

router.post('/:id', async (req, res) => {
  const userId = req.params.id;
  const { list_name } = req.body;

  try {
    const usersCollection = await bullsdb.collection('users');
    const result = await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      {
        $push: {
          favList: {
            list_name,
            tickers: [],
          },
        },
      }
    );

    if (result.matchedCount === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json({ message: 'Ticker list added successfully' });
  } catch (error) {
    console.error('Error adding ticker list:', error);
    res.status(500).send('Internal Server Error');
  }
});

export default router;
