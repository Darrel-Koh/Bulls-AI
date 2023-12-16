// glossaryGet.mjs
import express from "express";
import { bullsai } from "../db/conn.mjs";
import { ObjectId } from "mongodb";

// Create an Express Router
const glossaryRouter = express.Router();

// Route to get all glossary items
glossaryRouter.get("/glossary", async (req, res) => {
  try {
    let collection = await bullsai.collection("glossary"); // Use bullsai database
    let results = await collection.find({}).toArray();
    
    // Set the Content-Type header
    res.setHeader('Content-Type', 'application/json');
    
    res.send(results).status(200);
  } catch (error) {
    console.error('Error fetching glossary items:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Export the router
export default glossaryRouter;
