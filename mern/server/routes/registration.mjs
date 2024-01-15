import express from "express";
import { db, bullsdb } from "../db/conn.mjs";

const router = express.Router();

// Register a new user
router.post("/", async (req, res) => {
  const { registerEmail, registerPassword, registerFirstName } = req.body;

  console.log(
    `Received registration request: ${registerEmail}, ${registerFirstName}`
  ); // Log received registration request

  try {
    // Check if the email is already registered
    const existingUser = await bullsdb
      .collection("users")
      .findOne({ email: registerEmail });

    if (existingUser) {
      // Send 400 Bad Request status code and error message if email is already registered
      return res.status(400).send("Email is already registered");
    }

    // If the email is not registered, insert the new user into the database
    const newUser = {
      first_name: registerFirstName, // Change field name to first_name
      email: registerEmail,
      password: registerPassword,
    };

    await bullsdb.collection("users").insertOne(newUser);

    // Send a success response
    res.status(201).send("Registration successful");
  } catch (error) {
    console.error("Registration failed:", error.message);
    // Send 500 Internal Server Error status code and error message
    res.status(500).send("Internal Server Error");
  }
});

export default router;
