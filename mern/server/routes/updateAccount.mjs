import express from 'express';
import { ObjectId } from 'mongodb';
import { bullsdb } from '../db/conn.mjs';
import User from '../models/User.js'; // Import the User model

const router = express.Router();

router.patch('/update-account/:id', async (req, res) => {
    const userId = req.params.id;
    const { newAccountType } = req.body;

    // Validate newAccountType
    if (!newAccountType) {
        return res.status(400).json({ error: 'New account type is required' });
    }

    try {
        // Update account type using Mongoose methods
        const user = await User.findByIdAndUpdate(
            userId,
            { account_type: newAccountType },
            { new: true } // Return the updated document
        );

        // Check if the user exists
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Successful update
        return res.status(200).json({ message: 'Account type updated successfully', user });
    } catch (error) {
        console.error('Error updating account type:', error);
        return res.status(500).send('Internal Server Error');
    }
});

export default router;

