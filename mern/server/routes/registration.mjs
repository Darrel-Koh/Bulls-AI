import bcrypt from "bcrypt";
import express from "express";
import { db, bullsdb } from "../db/conn.mjs";

const router = express.Router();

// Password validation function
const isStrongPassword = (password) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return regex.test(password);
};

// Register a new user
router.post("/", async (req, res) => {
  const {
    registerEmail,
    registerPassword,
    registerUsername, // Change from 'registerFirstName' to 'registerUsername'
    registerAccountType,
  } = req.body;

  console.log(
    `Received registration request: ${registerEmail}, ${registerUsername}, ${registerAccountType}`
  );

  try {
    // Check if the email is already registered
    const existingUser = await bullsdb
      .collection("users")
      .findOne({ email: registerEmail });

    if (existingUser) {
      // Send 400 Bad Request status code and error message if email is already registered
      return res.status(400).send("Email is already registered");
    }

    // Check if the password meets the requirements
    if (!isStrongPassword(registerPassword)) {
      // Send 400 Bad Request status code and error message if the password is weak
      return res
        .status(400)
        .send(
          "Password must have at least 8 characters, 1 capital letter, 1 small letter, and 1 integer."
        );
    }

    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(registerPassword, 10);

    // If the email is not registered, insert the new user into the database
    const newUser = {
      username: registerUsername, // Change field name to 'username'
      email: registerEmail,
      password: hashedPassword,
      account_type: registerAccountType || "Basic",
      favList: [
        {
          list_name: "Favourite",
          tickers: [],
        },
      ],
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
