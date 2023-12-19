import express from "express";
import { bullsai } from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();

// Use POST method for login as it involves sensitive information (password)
router.post("/login", async (req, res) => {
  try {
    // Destructure email and password from the request body
    const { email, password } = req.body;

    // Checking users collection if email and password exist
    const userInfo = await bullsai
      .collection("users")
      .findOne({ email, password });

    // If userInfo is null, user not found
    if (!userInfo) {
      return res.status(404).send("Not found");
    }

    // If userInfo exists, send user information and redirect to mainpage
    res.status(200).send(userInfo);
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
