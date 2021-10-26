const express = require("express");
const passport = require("passport");
const { getShippingRewardId, createShipping, updateShipping, deleteShipping } = require("../controllers/shippingController");
const router = express.Router();

router.get("/get-by-reward-id/:rewardId", getShippingRewardId);
router.post("/create", passport.authenticate("jwt-user", { session: false }), createShipping);
router.put("/update/:id", passport.authenticate("jwt-user", { session: false }), updateShipping);
router.delete("/delete/:id", passport.authenticate("jwt-user", { session: false }), deleteShipping);

module.exports = router;
