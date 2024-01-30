// tickerpageGet.mjs
import express from "express";
import { bullsdb } from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();

// Get a list of all users
router.get("/", async (req, res) => {
  try {
    const collection = await bullsdb.collection("users");
    const results = await collection.find({}).toArray();
    res.send(results).status(200);
  } catch (error) {
    console.error("Error getting user data:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Get a single user's details by ID
router.get("/:id", async (req, res) => {
  try {
    const collection = await bullsdb.collection("users");
    const userId = req.params.id;

    // Ensure that the userId is a valid ObjectId
    if (!ObjectId.isValid(userId)) {
      return res.status(400).send("Invalid user ID");
    }

    const query = { _id: new ObjectId(userId) };
    const result = await collection.findOne(query);

    if (!result) res.status(404).send("Not found");
    else res.status(200).send(result);
  } catch (error) {
    console.error("Error getting user details:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Get a single ticker's details by ID
router.get("/:id", async (req, res) => {
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

// Get a single ticker's details by ID
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
