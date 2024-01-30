import bcrypt from "bcrypt";
import express from "express";
import { db, bullsdb } from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();

// Check whether email and password exist in the database
router.post("/", async (req, res) => {
  const { email, password } = req.body;

  console.log(`Received email: ${email}, password: ${password}`); // Log received email and password

  try {
    // Retrieve user information from the database based on the email
    const userInfo = await bullsdb.collection("users").findOne({ email });

    if (!userInfo) {
      // Send 401 Unauthorized status code and error message
      return res.status(401).send("Invalid email or password");
    }

    // Compare the provided password with the hashed password stored in the database
    const passwordMatch = await bcrypt.compare(password, userInfo.password);

    if (!passwordMatch) {
      // Send 401 Unauthorized status code and error message if passwords don't match
      return res.status(401).send("Invalid email or password");
    }

    // Send a success response
    res.status(200).json(userInfo);
  } catch (error) {
    console.error("Login failed:", error.message);
    // Send 500 Internal Server Error status code and error message
    res.status(500).send("Internal Server Error");
  }
});

export default router;
