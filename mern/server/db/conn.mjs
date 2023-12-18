// conn.mjs
import { MongoClient } from "mongodb";

const connectionString = process.env.ATLAS_URI || "";

const client = new MongoClient(connectionString);

let conn;
let conn1;
try {
  console.log("Connecting to MongoDB Atlas...");
  conn = await client.connect();
  conn1 = await client.connect();
} catch(e) {
  console.error(e);
}

let db = conn.db("sample_training");
let bullsai = conn1.db("bullsai");

export {db, bullsai };

