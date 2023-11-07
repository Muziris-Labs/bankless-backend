const mongoose = require("mongoose");

const ContributorSchema = new mongoose.Schema({
  pubkey: {
    type: String,
    required: true,
  },

  name: {
    type: String,
    required: true,
  },

  safe: {
    type: String,
    required: true,
  },

  addedBy: {
    type: String,
    required: true,
  },
});

module.exports = Contributor = mongoose.model("Contributor", ContributorSchema);
