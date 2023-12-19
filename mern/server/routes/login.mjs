import express from "express";
import { bullsai } from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    // Destructure email and password from the request body
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Avoid storing plain-text passwords in your database
    const userInfo = await bullsai
      .collection("users")
      .findOne({ email, password });

    // If userInfo is null, user not found
    if (!userInfo) {
      return res.status(404).json({ error: "User not found" });
    }

    // If userInfo exists, send only necessary user information (without password) and redirect to main page
    const { _id, username, email: userEmail } = userInfo;
    res.status(200).json({ _id, username, email: userEmail });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
