const express = require("express");
const router = express.Router();
require("dotenv").config();
const auth = require("../../middleware/auth");
const safeAuth = require("../../middleware/safeAuth");

const Transaction = require("../../models/transaction");

router.post("/add", [auth], async (req, res) => {
  const status = req.body.status;

  const price = req.body.price;

  const contributor = req.body.contributor;

  const sender = req.body.sender;

  const role = req.body.role;

  if (!status || !price || !contributor || !sender || !role) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  try {
    const newTransaction = new Transaction({
      status,
      price,
      contributor,
      sender,
      role,
    });

    const transaction = await newTransaction.save();

    res.json(transaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server Error" });
  }
});

router.get("/:sender/all", auth, async (req, res) => {
  const sender = req.params.sender;
  try {
    const transactions = await Transaction.find({ sender });
    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server Error" });
  }
});

module.exports = router;
