import express from "express";
import { db, bullsdb } from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();

router.get("/:tickername", async (req, res) => {
    try {
        const collection = bullsdb.collection("ticker_data");
        const query = { trading_name: req.params.tickername };
        const result = await collection.findOne(query);

        if (!result) {
            res.status(404).json({ message: "Data not found" });
            return;
        }

        // Send the result as a JSON response
        res.json(result);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;
