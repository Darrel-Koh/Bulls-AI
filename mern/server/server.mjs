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

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import tickerpage from "./routes/tickerpageGet.mjs";
import tickerListRouter from "./routes/addtickerlistGet.mjs";
import deletetickerListRouter from "./routes/deletetickerlistGet.mjs";
import deleteTicker from "./routes/deleteTicker.mjs";
import mainpage from "./routes/mainpage.mjs";
import searchRoute from "./routes/searchRoute.mjs";
import compression from 'compression';
import edittickerlistRouter from "./routes/edittickerlistpageGet.mjs";

const PORT = 5050;
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
app.use("/edit-tickerlist",edittickerlistRouter);


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



app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
