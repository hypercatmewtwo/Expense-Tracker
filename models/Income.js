// models/Income.js
const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  category: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
});

module.exports = mongoose.model('Income', incomeSchema);