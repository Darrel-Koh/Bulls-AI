import express from "express";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt"; // Import bcrypt
import { db, bullsdb } from "../db/conn.mjs";

const router = express.Router();

router.post("/", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await bullsdb.collection("users").findOne({ email });

    if (!user) {
      return res.status(404).send("User not found.");
    }

    // Generate temporary password
    const temporaryPassword = Math.random().toString(36).slice(-8);

    // Hash the temporary password using bcrypt
    const hashedTemporaryPassword = await bcrypt.hash(temporaryPassword, 10);

    // Update user document in the database with the hashed temporary password
    await bullsdb
      .collection("users")
      .updateOne({ email }, { $set: { password: hashedTemporaryPassword } });

    // Send email with temporary password
    const transporter = nodemailer.createTransport({
      service: "outlook",
      auth: {
        user: "bullsai001@outlook.com",
        pass: "Applebanana!",
      },
    });

    const mailOptions = {
      from: "bullsai001@outlook.com",
      to: email,
      subject: "Password Reset Request",
      text: `Your temporary password is: ${temporaryPassword}. Please change your password after logging in.`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).send("Temporary password sent to your email.");
  } catch (error) {
    console.error("Password reset failed:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
