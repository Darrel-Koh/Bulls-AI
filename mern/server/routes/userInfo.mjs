//userInfo.mjs
import express from 'express';
import { ObjectId } from 'mongodb';
import { bullsdb } from '../db/conn.mjs';

const router = express.Router();

// This section will help you get a single record by id
router.get("/:id", async (req, res) => {
  let collection = await bullsdb.collection("users");
  let query = {_id: new ObjectId(req.params.id)};
  let result = await collection.findOne(query);

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});
  
  export default router;


