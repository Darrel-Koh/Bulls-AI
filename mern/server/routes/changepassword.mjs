import bcrypt from "bcrypt";
import express from "express";
import { bullsdb } from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();

// Password validation function
const isStrongPassword = (password) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return regex.test(password);
};

// Endpoint to change user password
router.post("/", async (req, res) => {
  const { currentPassword, newPassword, userId } = req.body;
  // const userId = req.user.id; // Assuming you have middleware to extract user information
  var o_id = new ObjectId(userId);
  try {
    // Retrieve user information from the database based on userId
    const userInfo = await bullsdb.collection("users").findOne({ _id: o_id });

    if (!userInfo) {
      // Send 401 Unauthorized status code and error message
      return res.status(401).send("User not found.");
    }

    // Check if the new password meets the requirements
    if (!isStrongPassword(newPassword)) {
      // Send 400 Bad Request status code and error message if the password is weak
      return res
        .status(400)
        .send(
          "New password must have at least 8 characters, 1 capital letter, 1 small letter, and 1 integer."
        );
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
      .updateOne({ _id: o_id }, { $set: { password: hashedNewPassword } });

    // Send a success response
    res.status(200).send("Password changed successfully.");
  } catch (error) {
    console.error("Error changing password:", error.message);
    // Send 500 Internal Server Error status code and error message
    res.status(500).send("Internal Server Error");
  }
});

export default router;
