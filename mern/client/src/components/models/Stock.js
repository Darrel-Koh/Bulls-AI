import { Schema, model } from 'mongoose';

const stockSchema = new Schema({
  symbol: String,
  companyName: String,
  // Add more fields as needed
});

const Stock = model('Stock', stockSchema);

export default Stock;
