require("dotenv").config();
const axios = require("axios");

module.exports = async function (req, res, next) {
  const { safeAddress } = req.body;

  const SAFE_TRANSACTION_API = {
    mainnet: "https://safe-transaction-mainnet.safe.global",
  };

  if (!safeAddress) {
    return res
      .status(401)
      .json({ msg: "No safe address, authorization denied" });
  }

  const pubkey = req.pubkey;

  try {
    const safes = await axios.get(
      `${SAFE_TRANSACTION_API.mainnet}/api/v1/owners/${pubkey}/safes/`
    );

    const userSafes = safes.data.safes;

    const safe = userSafes.find((safe) => safe === safeAddress);

    if (!safe) {
      return res.status(401).json({ msg: "Safe not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Server Error" });
  }

  next();
};
