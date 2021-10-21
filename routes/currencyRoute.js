const express = require("express");
const { getAllCurrency, createCurrency, updateCurrency, deleteCurrency } = require("../controllers/currencyController");
const router = express.Router();

router.get("/get-all", getAllCurrency);
router.post("/create", createCurrency);
router.put("/update/:id", updateCurrency);
router.delete("/delete/:id", deleteCurrency);

module.exports = router;
