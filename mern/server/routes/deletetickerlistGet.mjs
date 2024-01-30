// deletetickerlistGet.mjs
import express from 'express';
import { bullsdb } from '../db/conn.mjs';
import { ObjectId } from 'mongodb';

const router = express.Router();

router.delete('/:id/:listName', async (req, res) => {
  const userId = req.params.id;
  const listName = req.params.listName;
  
  console.log('Received userId:', userId);
  console.log('Received listName:', listName);
  try {
    const usersCollection = await bullsdb.collection('users');
    const query = {
      _id: new ObjectId(userId),
    };

    const update = {
      $pull: {
        favList: { list_name: listName },
      },
    };

    const result = await usersCollection.updateOne(query, update);

    if (result.matchedCount === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json({ message: 'Ticker list deleted successfully' });
  } catch (error) {
    console.error('Error deleting ticker list:', error);
    res.status(500).send('Internal Server Error');
  }
});

export default router;
