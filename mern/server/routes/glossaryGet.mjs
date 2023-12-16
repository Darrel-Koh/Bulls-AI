// glossaryGet.mjs
import express from "express";
import { bullsai } from "../db/conn.mjs";

const router = express.Router();

router.get("/glossary", async (req, res) => {
  try {
    let collection = await bullsai.collection("glossary");
    let results = await collection.find({}).toArray();
    res.setHeader('Content-Type', 'application/json');
    res.send(results).status(200);
  } catch (error) {
    console.error('Error fetching glossary items:', error);

    // Send an error response with a meaningful message
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

export default router;
