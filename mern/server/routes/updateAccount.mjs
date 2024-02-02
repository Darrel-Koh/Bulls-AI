// updateAccount.mjs

// Import necessary modules
import express from 'express';
import { bullsdb } from '../db/conn.mjs';
import User from '../models/User.js';

const router = express.Router();

router.put('/update-account/:id', async (req, res) => {
    const userId = req.params.id;
    const { newAccountType } = req.body;
  
    try {
      const usersCollection = await bullsdb.collection('users');
      const result = await usersCollection.updateOne(
        { _id: userId },
        {
          $set: {
            account_type: newAccountType,
          },
        }
      );
  
      if (result.matchedCount === 0) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

  
      res.status(200).json({ message: 'Account type updated successfully' });
    } catch (error) {
      console.error('Error updating account type:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  
  

export default router;