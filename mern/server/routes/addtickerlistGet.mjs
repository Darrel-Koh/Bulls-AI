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

    // Check if the list_name already exists for the user
    const existingUser = await usersCollection.findOne({
      _id: new ObjectId(userId),
      'favList.list_name': list_name,
    });

    if (existingUser) {
      // If the list_name already exists, send a 409 Conflict status
      console.log('Old List Name:', list_name);
      return res.status(409).json({ error: 'List name already exists' });

    }

    // If the list_name doesn't exist, add it to the user's favorites list
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
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'Ticker list added successfully' });
  } catch (error) {
    console.error('Error adding ticker list:', error);
    res.status(500).send('Internal Server Error');
  }
});

export default router;
