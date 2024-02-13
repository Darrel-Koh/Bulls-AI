// server.mjs
import express from "express";
import cors from "cors";
import "./loadEnvironment.mjs";
import records from "./routes/record.mjs";
import user from "./routes/record2.mjs";
import loginRouter from "./routes/login.mjs";
import registrationRouter from "./routes/registration.mjs";
import forgetPasswordRouter from "./routes/forgetPassword.mjs";
import changePasswordRouter from "./routes/changepassword.mjs"; // Import the new changePassword router
import { db, bullsdb } from "../server/db/conn.mjs";
import glossary from "./routes/glossaryGet.mjs";
import modelsRouter from "./routes/models.mjs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import tickerpage from "./routes/tickerpageGet.mjs";
import tickerListRouter from "./routes/addtickerlistGet.mjs";
import deletetickerListRouter from "./routes/deletetickerlistGet.mjs";
import deleteTicker from "./routes/deleteTicker.mjs";
import mainpage from "./routes/mainpage.mjs";
import searchRoute from "./routes/searchRoute.mjs";
import compression from 'compression';

// const PORT = 5050;

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(compression());

app.use("/record", records);
app.use("/user", user);
app.use("/login", loginRouter);
app.use("/register", registrationRouter);
app.use("/forget-password", forgetPasswordRouter);
app.use("/change-password", changePasswordRouter); // Use the changePassword router
app.use("/model", modelsRouter);

// Serve static files from the "tfjs_models" directory
app.use("/tfjs_model", express.static(path.join(__dirname, "tfjs_model")));


app.use("/api/data", mainpage);
app.use("/api/search", mainpage);



app.use("/my-ticker", tickerpage);
app.use("/add-tickerlist", tickerListRouter);
app.use("/delete-tickerlist", deletetickerListRouter);
app.use("/delete-tickers", deleteTicker);

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


// if(process.env.NODE_ENV === 'production'){
//   app.use(express.static('client/build'));
//   app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
//   });
// } 
if(process.env.NODE_ENV === 'production'){
  // Serve static files from the React app
  app.use(express.static(path.join(__dirname, '../client/build')));

  // The "catchall" handler: for any request that doesn't
  // match one above, send back React's index.html file.
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
  });
}
else {
  app.get("*", (req, res) => {
    res.send("API is running");
  });
}


const port = process.env.PORT || 5050;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
