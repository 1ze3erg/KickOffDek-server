const express = require("express");
const passport = require("passport");
const { getAllCurrency, createCurrency, updateCurrency, deleteCurrency } = require("../controllers/currencyController");
const router = express.Router();

router.get("/get-all", getAllCurrency);
router.post("/create", passport.authenticate("jwt-admin", { session: false }), createCurrency);
router.put("/update/:id", passport.authenticate("jwt-admin", { session: false }), updateCurrency);
router.delete("/delete/:id", passport.authenticate("jwt-admin", { session: false }), deleteCurrency);

module.exports = router;
