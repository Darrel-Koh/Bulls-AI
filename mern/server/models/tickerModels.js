// tickerModels.js
import mongoose from 'mongoose';


const transactionSchema = new mongoose.Schema({
    Date: Date,
    'Adj Close': Number,
    Close: Number,
    High: Number,
    Low: Number,
    Open: Number,
    Volume: Number,
});

const tickerDataSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId, // Define _id explicitly
    trading_name: { type: String, required: true },
    symbol: String,
    transaction_count: Number,
    bucket_start_date: Date,
    bucket_end_date: Date,
    transactions: [transactionSchema],
});

tickerDataSchema.index({ trading_name: 'text' });

const TickerData = mongoose.model('ticker_data', tickerDataSchema);

export default TickerData;
