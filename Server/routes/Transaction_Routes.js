const express = require("express");
const router = express.Router();

const { fetchApi } = require("../controllers/Transaction");
const {listTransactions, getStatistics, getPriceRangeDistribution, getCategoryDistribution, getCombinedData} = require("../controllers/Transaction");

router.get("/fetchApi", fetchApi);
router.get("/listTransactions", listTransactions);
router.get("/getStatistics", getStatistics);
router.get("/getPriceRangeDistribution", getPriceRangeDistribution);
router.get("/getCategoryDistribution", getCategoryDistribution);
router.post("/getCombinedData", getCombinedData);

module.exports = router;
