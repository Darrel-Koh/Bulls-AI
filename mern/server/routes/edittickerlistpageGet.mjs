// Import necessary modules
import express from 'express';
import { bullsdb } from '../db/conn.mjs';
import { ObjectId } from 'mongodb';

// Create an Express router
const router = express.Router();

// Handle the PUT request to update the list name
router.put('/:id/:oldlistname/:newlistname', async (req, res) => {
  try {
    // Extract parameters from the request
    const userId = req.params.id;
    const oldListName = req.params.oldlistname;
    const newListName = req.params.newlistname;

    // Access the "users" collection from the MongoDB database
    const usersCollection = await bullsdb.collection('users');

    // Define the query to find the user with the specified ID and old ticker list name
    const query = {
      _id: new ObjectId(userId),
      'favList.list_name': oldListName,
    };

    // Define the update operation
    const update = {
      $set: {
        'favList.$.list_name': newListName,
      },
    };

    // Use the updateOne method to update the list name
    const result = await usersCollection.updateOne(query, update);

    // Check if a document was matched and modified
    if (result.matchedCount === 0) {
      res.status(404).json({ error: 'User or ticker list not found' });
      return;
    }

    // Respond with a success message
    res.status(200).json({ message: 'Ticker list name updated successfully' });
  } catch (error) {
    // Handle errors that may occur during the database operation
    console.error('Error updating ticker list name:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Export the router for use in other parts of the application
export default router;
