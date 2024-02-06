import bcrypt from "bcrypt";
import express from "express";
import { bullsdb } from "../db/conn.mjs";

const router = express.Router();

// Endpoint to change user password
router.post("/", async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id; // Assuming you have middleware to extract user information

  try {
    // Retrieve user information from the database based on userId
    const userInfo = await bullsdb.collection("users").findOne({ _id: userId });

    if (!userInfo) {
      // Send 401 Unauthorized status code and error message
      return res.status(401).send("User not found.");
    }

    // Compare the provided current password with the hashed password stored in the database
    const passwordMatch = await bcrypt.compare(
      currentPassword,
      userInfo.password
    );

    if (!passwordMatch) {
      // Send 401 Unauthorized status code and error message if passwords don't match
      return res.status(401).send("Current password is incorrect.");
    }

    // Hash the new password before updating it in the database
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password in the database
    await bullsdb
      .collection("users")
      .updateOne({ _id: userId }, { $set: { password: hashedNewPassword } });

    // Send a success response
    res.status(200).send("Password changed successfully.");
  } catch (error) {
    console.error("Error changing password:", error.message);
    // Send 500 Internal Server Error status code and error message
    res.status(500).send("Internal Server Error");
  }
});

export default router;
