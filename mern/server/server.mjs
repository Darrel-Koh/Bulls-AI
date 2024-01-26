import express from "express";
import cors from "cors";
import "./loadEnvironment.mjs";
import records from "./routes/record.mjs";
import user from "./routes/record2.mjs";
import loginRouter from "./routes/login.mjs";
import registrationRouter from "./routes/registration.mjs";
import forgetPasswordRouter from "./routes/forgetPassword.mjs"; // Import the new forgetPassword router
import { db, bullsdb } from "../server/db/conn.mjs";
import glossary from "./routes/glossaryGet.mjs";

const PORT = 5050;
const app = express();

app.use(cors());
app.use(express.json());

app.use("/record", records);
app.use("/user", user);
app.use("/login", loginRouter);
app.use("/register", registrationRouter);
app.use("/forget-password", forgetPasswordRouter); // Use the forgetPassword router

app.get("/db-test", async (req, res) => {
  try {
    let collection = await bullsdb.collection("users");
    let results = await collection.find({}).limit(1).toArray();
    res.status(200).send("Database connection successful");
  } catch (error) {
    res.status(500).send("Database connection failed");
  }
});

app.use("/glossary", glossary);

// start the Express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
