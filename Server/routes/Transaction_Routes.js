const express = require("express");
const router = express.Router();

const { fetchApi } = require("../controllers/Transaction");
const {getCombinedData} = require("../controllers/Transaction");

router.get("/fetchApi", fetchApi);
router.post("/getCombinedData", getCombinedData);

module.exports = router;
