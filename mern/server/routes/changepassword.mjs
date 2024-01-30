import express from "express";
import bcrypt from "bcrypt";
import { bullsdb } from "../db/conn.mjs";

const router = express.Router();

router.post("/", async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  // Assume you have a user object stored in the request. You can extract the user ID or any other required information.
  const userId = req.user.id; // Replace this with the actual way you get the user ID from the request.

  try {
    // Retrieve the user information from the database based on the user ID
    const userInfo = await bullsdb.collection("users").findOne({ _id: userId });

    if (!userInfo) {
      // Send 401 Unauthorized status code and error message
      return res.status(401).send("User not found");
    }

    // Compare the provided current password with the hashed password stored in the database
    const passwordMatch = await bcrypt.compare(
      currentPassword,
      userInfo.password
    );

    if (!passwordMatch) {
      // Send 401 Unauthorized status code and error message if the current password is incorrect
      return res.status(401).send("Current password is incorrect");
    }

    // Hash the new password before updating it in the database
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password in the database
    await bullsdb
      .collection("users")
      .updateOne({ _id: userId }, { $set: { password: hashedNewPassword } });

    // Send a success response
    res.status(200).send("Password changed successfully");
  } catch (error) {
    console.error("Password change failed:", error.message);
    // Send 500 Internal Server Error status code and error message
    res.status(500).send("Internal Server Error");
  }
});

export default router;
