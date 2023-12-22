import express from "express";
// const express = require("express");
import cors from "cors";
import mongoose from "mongoose";

const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

const PORT = 5050;


mongoose.connect("mongodb+srv://DarAdmin:strongpassword@bullscluster.9efqbnh.mongodb.net/bullsai", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Get the default connection
const db = mongoose.connection;

// Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
// Bind connection to open event (to get notification of connection success)
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Rest of your code...


//user schema 
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
})

const User = new mongoose.model("User", userSchema)

app.post("/Login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });

    if (user) {
      if (password === user.password) {
        res.send({ message: "login success", user: user });
      } else {
        res.send({ message: "wrong credentials" });
      }
    } else {
      res.send("not registered");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

app.post("/Register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      // User already exists, send an appropriate response
      res.send({ message: "User already exists" });
    } else {
      // Create a new user instance
      const newUser = new User({ name, email, password });

      // Save the new user to the database
      await newUser.save();

      // Send a success response
      res.send({ message: "Registration successful" });
    }
  } catch (error) {
    // Handle errors and send an internal server error response
    console.error(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});
 
// start the Express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
