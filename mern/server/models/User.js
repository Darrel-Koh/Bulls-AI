// User.js

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId, // Define _id explicitly
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true // Ensure uniqueness of email addresses
  },
  password: {
    type: String,
    required: true
  },
  account_type: {
    type: String,
    enum: ['Basic', 'Professional'], // Example of using enum for account type
    default: 'Basic'
  },
  favList: [{
    list_name: String,
    tickers: [String] // Assuming tickers are strings
  }]
});

// Create and export the User model
const UserData = mongoose.model('User', userSchema);

export default UserData;