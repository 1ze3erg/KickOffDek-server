const express = require("express");
const passport = require("passport");
const { getPaymentByUserId, createPayment, updatePayment, deletePayment } = require("../controllers/paymentController");
const router = express.Router();

router.get("/get-by-user-id", passport.authenticate("jwt-user", { session: false }), getPaymentByUserId);
router.post("/create", passport.authenticate("jwt-user", { session: false }), createPayment);
router.put("/update/:id", passport.authenticate("jwt-user", { session: false }), updatePayment);
router.delete("/delete/:id", passport.authenticate("jwt-user", { session: false }), deletePayment);

module.exports = router;
