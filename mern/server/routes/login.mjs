import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();

// Check whether email and password exist in database
router.get("/login", async (req, res) => {
  // Checking users table if email and password exist
  const userInfo = await db
    .collection("users")
    .findOne({ email: req.body.userName, password: req.body.password });

  // if userInfo = null
  if (!userInfo) {
    res.send("Not found").status(404);

    // if userInfo exist
  } else {
    res.send(userInfo).status(200);
  }
});
