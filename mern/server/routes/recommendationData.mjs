import express from 'express';
import { ObjectId } from 'mongodb';
import { bullsdb } from '../db/conn.mjs';

const router = express.Router();

router.get("/", async (req, res) => {
    let collection = await bullsdb.collection("recommendations");
    // Limit to 632 collections for faster loading process
    let results = await collection.find({}).toArray(); 
    res.send(results).status(200);
});

router.get("/ticker/:id", async (req, res) => {
    try {
      const collection = await bullsdb.collection("ticker_data");
      const tickerId = req.params.id;
  
      // Ensure that the userId is a valid ObjectId
      if (!ObjectId.isValid(tickerId)) {
        return res.status(400).send("Invalid ticker ID");
      }
  
      const query = { _id: new ObjectId(tickerId) };
      const result = await collection.findOne(query);
  
      if (!result) res.status(404).send("Not found");
      else res.status(200).send(result);
    } catch (error) {
      console.error("Error getting user details:", error);
      res.status(500).send("Internal Server Error");
    }
  });

export default router;
