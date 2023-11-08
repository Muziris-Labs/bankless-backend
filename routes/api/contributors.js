const express = require("express");
const router = express.Router();
require("dotenv").config();
const auth = require("../../middleware/auth");
const safeAuth = require("../../middleware/safeAuth");

const Contributor = require("../../models/contributor");

router.post("/add", [auth, safeAuth], async (req, res) => {
  const safeAddress = req.body.safeAddress;

  const name = req.body.name;

  const contributorPubkey = req.body.contributorPubkey;

  if (!safeAddress || !name || !contributorPubkey) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  try {
    const existingContributor = await Contributor.findOne({
      pubkey: contributorPubkey,
      safe: safeAddress,
    });

    if (existingContributor) {
      return res.status(400).json({ msg: "Contributor already exists" });
    }

    const newContributor = new Contributor({
      pubkey: contributorPubkey,
      safe: safeAddress,
      name,
      addedBy: req.pubkey,
    });

    const contributor = await newContributor.save();

    res.json(contributor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server Error" });
  }
});

router.get("/:safeAddress/all", auth, async (req, res) => {
  const safeAddress = req.params.safeAddress;
  try {
    const contributors = await Contributor.find({ safe: safeAddress });
    res.json(contributors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server Error" });
  }
});

router.delete("/delete/:pubkey", [auth, safeAuth], async (req, res) => {
  const pubkey = req.params.pubkey;
  const safeAddress = req.body.safeAddress;

  try {
    const contributor = await Contributor.findOne({
      pubkey,
      safe: safeAddress,
    });

    if (!contributor) {
      return res.status(404).json({ msg: "Contributor not found" });
    }

    await contributor.deleteOne();

    res.json({ msg: "Contributor removed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server Error" });
  }
});

router.put("/update/:pubkey", [auth, safeAuth], async (req, res) => {
  const pubkey = req.params.pubkey;
  const safeAddress = req.body.safeAddress;

  const name = req.body.name;

  try {
    const contributor = await Contributor.findOne({
      pubkey,
      safe: safeAddress,
    });

    if (!contributor) {
      return res.status(404).json({ msg: "Contributor not found" });
    }

    contributor.name = name;

    await contributor.save();

    res.json(contributor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server Error" });
  }
});

module.exports = router;
