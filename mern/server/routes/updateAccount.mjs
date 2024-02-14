import express from 'express';
import { ObjectId } from 'mongodb';
import { bullsdb } from '../db/conn.mjs';
import User from '../models/User.js'; // Import the User model

const router = express.Router();

// Endpoint to update user's account type
router.post("/", async (req, res) => {
    const { newAccountType, userId } = req.body;
    // const userId = req.user.id; // Assuming you have middleware to extract user information
    const o_id = new ObjectId(userId);
  
    try {
      // Retrieve user information from the database based on userId
      const userInfo = await bullsdb.collection("users").findOne({ _id: o_id });
  
      if (!userInfo) {
        // Send 401 Unauthorized status code and error message
        return res.status(401).send("User not found.");
      }
  
      // Update the user's account type in the database
      await bullsdb
        .collection("users")
        .updateOne({ _id: o_id }, { $set: { account_type: newAccountType } });
  
      // Send a success response
      res.status(200).send("Account type updated successfully.");
    } catch (error) {
      console.error("Error updating account type:", error.message);
      // Send 500 Internal Server Error status code and error message
      res.status(500).send("Internal Server Error");
    }
  });
  
  export default router;