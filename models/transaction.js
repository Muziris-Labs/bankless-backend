const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  status: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  contributor: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    default: Date.now,
  },
  sender: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
});

module.exports = Transaction = mongoose.model("Transaction", TransactionSchema);
