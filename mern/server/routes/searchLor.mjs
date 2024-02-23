import express from "express";
import { db, bullsdb } from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();

router.get("/:tickername", async (req, res) => {
    try {
        const collection = bullsdb.collection("ticker_data");
        const query = { trading_name: req.params.tickername };
        const result = await collection.findOne(query);

        if (!result || !result.plot_data) {
            res.status(404).json({ message: "Plot data not found" });
            return;
        }

        // Send the plot data as a response
        res.set("Content-Type", "image/png");
        res.send(result.plot_data.buffer);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;
