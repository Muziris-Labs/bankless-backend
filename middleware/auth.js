require("dotenv").config();
const ethers = require("ethers");

module.exports = async function (req, res, next) {
  const signature = req.header("x-auth-sig");

  if (!signature) {
    return res.status(401).json({ msg: "No signature, authorization denied" });
  }

  const pubkey = req.header("x-auth-pubkey");

  if (!pubkey) {
    return res.status(401).json({ msg: "No pubkey, authorization denied" });
  }

  const message = process.env.AUTH_MESSAGE;

  const recoveredAddress = ethers.utils.verifyMessage(message, signature);

  if (recoveredAddress !== pubkey) {
    return res.status(401).json({ msg: "Signature verification failed" });
  }

  req.pubkey = pubkey;

  next();
};
