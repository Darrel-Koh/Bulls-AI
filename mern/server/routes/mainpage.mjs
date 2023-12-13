import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();

// This section will help you get a list of all the main page info.
router.get("/", async (req, res) => {
  let collection = await db.collection("mainPageInfo");
  let results = await collection.find({}).toArray();
  res.send(results).status(200);
});

// This section is the search bar.
router.get("/search", async (req, res) => {
  let collection = await db.collection("mainPageInfo");
  let results = await collection
    .find({ ticker: req.body.tickerName })
    .toArray();
  res.send(results).status(200);
});
