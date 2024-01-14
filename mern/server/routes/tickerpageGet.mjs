// tickerpageGet.mjs
import express from "express";
import { bullsdb } from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();

router.get("/", async (req, res) => {
  let collection = await bullsdb.collection("users");
  let results = await collection.find({}).toArray();
  const userFavlists = results.map((user) => user.favlist);
  res.send(userFavlists).status(200);
});

router.get("/:id", async (req, res) => {
  let collection = await bullsdb.collection("users");
  let query = { _id: new ObjectId(req.params.id) };
  let result = await collection.findOne(query);

  if (!result) res.send("Not found").status(404);
  else res.send(result.favlist).status(200);
});

router.get("/:favlist", async (req, res) => {
  try {
    const collection = await bullsdb.collection("users");
    const query = { "favlist._id": new ObjectId(req.params.favlist) };
    const result = await collection.findOne(query);

    if (!result) {
      res.status(404).send("Not found");
    } else {
      res.status(200).send(result.favlist).status(200);
    }
  } catch (error) {
    console.error("Error fetching favlist:", error);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
