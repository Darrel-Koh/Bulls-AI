import express from "express";
import {db, bullsdb} from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();

// Check whether email and password exist in database
router.post("/", async (req, res) => {
  const { email, password } = req.body;

  console.log(`Received email: ${email}, password: ${password}`); // Log received email and password

  const userInfo = await bullsdb
    .collection("users")
    .findOne({ email, password });

  if (!userInfo) {
    // Send 401 Unauthorized status code and error message
    res.status(401).send("Invalid email or password");
  } else {
    res.status(200).json(userInfo);
  }
});

export default router;