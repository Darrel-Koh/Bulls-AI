import express from "express";
// import db from "../db/conn.mjs";
import {db, bullsdb} from "../db/conn.mjs"
import { ObjectId } from "mongodb";

const router = express.Router();

router.get('/model/:ticker', async (req, res) => {
  const collection = db.collection('models');
  const doc = await collection.findOne({ ticker: req.params.ticker });

  if (!doc || !doc.model) {
    res.status(404).send('No model found');
    return;
  }

  res.send(doc.model.buffer);
});


export default router;
