import express from "express";
import {db, bullsdb} from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();

// Check whether email and password exist in database
router.post("/", async (req, res) => {
  // Checking users table if email and password exist
  const userInfo = await bullsdb
    .collection("users")
    .findOne({ email: req.body.email, password: req.body.password });

  // if userInfo = null
  if (!userInfo) {
    res.status(404).send("Not found");
  } else {
    // if userInfo exist
    res.status(200).json(userInfo);
    // res.redirect("/mainPage"); // This won't work after res.json or res.send
  }
});

export default router;