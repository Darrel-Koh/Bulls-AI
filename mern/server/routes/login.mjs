import express from "express";
import { bullsai } from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();

// Check whether email and password exist in database
router.get("/login", async (req, res) => {
  // Checking users table if email and password exist
  const userInfo = await bullsai
    .collection("users")
    .findOne({ email: req.params.userName, password: req.params.password });

  // if userInfo = null
  if (!userInfo) {
    res.send("Not found").status(404);

    // if userInfo exist
  } else {
    res.send(userInfo).status(200);
    return redirect("/mainpage");
  }
});

export default router;
