// recommendationModel.js

import mongoose from 'mongoose';

const { Schema } = mongoose;

// Define the schema for the trading data
const recommendationDataSchema = new Schema({
_id: mongoose.Schema.Types.ObjectId, // Define _id explicitly
  trading_name: { type: String, required: true },
  symbol: { type: String, required: true },
  last: { type: Number, required: true },
  chng: { type: String, required: true }, // Change can be a string
  chngPercent: { type: String, required: true }, // Change percentage can be a string
  valMillions: { type: Number, required: true },
  volThousands: { type: Number, required: true }
});

// Create and export the TradingData model
const RecommendationData = mongoose.model('RecommendationData', recommendationDataSchema);

export default RecommendationData;
