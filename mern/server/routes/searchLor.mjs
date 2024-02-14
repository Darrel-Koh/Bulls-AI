import express from "express";
// import db from "../db/conn.mjs";
import {db, bullsdb} from "../db/conn.mjs"
import { ObjectId } from "mongodb";

const router = express.Router();


router.get("/:tickername", async (req, res) => {
    let collection = await bullsdb.collection("ticker_data");
    let query = {trading_name : req.params.tickername}; // Changed this line
    let result = await collection.findOne(query);
  
    if (!result) res.status(404).send("Not found"); // Changed this line
    else res.status(200).send(result); // Changed this line
});


export default router;