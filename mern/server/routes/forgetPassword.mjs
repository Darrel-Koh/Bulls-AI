import express from "express";
import { bullsdb } from "../db/conn.mjs";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";

const router = express.Router();

router.post("/", async (req, res) => {
  const { email } = req.body;

  try {
    // Check if the email is registered
    const user = await bullsdb.collection("users").findOne({ email });

    if (!user) {
      return res.status(404).send("Email not found");
    }

    // Generate a new temporary password
    const tempPassword = Math.random().toString(36).slice(-8);

    // Hash the temporary password before storing it in the database
    const hashedTempPassword = await bcrypt.hash(tempPassword, 10);

    // Update the user's password with the hashed temporary password
    await bullsdb
      .collection("users")
      .updateOne({ email }, { $set: { password: hashedTempPassword } });

    // Send the temporary password to the user via email
    await sendEmail(email, tempPassword);

    res.status(200).send("Password reset successful");
  } catch (error) {
    console.error("Password reset failed:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

// Function to send email using Nodemailer
const sendEmail = async (to, tempPassword) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "bullsai001@gmail.com",
      pass: "Applebanana!",
    },
  });

  const mailOptions = {
    from: "bullsai001@gmail.com",
    to,
    subject: "Password Reset",
    text: `Your temporary password is: ${tempPassword}`,
  };

  await transporter.sendMail(mailOptions);
};

export default router;
