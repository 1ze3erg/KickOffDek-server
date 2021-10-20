const express = require("express");
const passport = require("passport");
const {
    getShippingAddressByUserId,
    createShippingAddress,
    updateShippingAddress,
    deleteShippingAddress,
} = require("../controllers/shippingAddressController");
const router = express.Router();

router.get("/get-by-user-id", passport.authenticate("jwt-user", { session: false }), getShippingAddressByUserId);
router.post("/create", passport.authenticate("jwt-user", { session: false }), createShippingAddress);
router.put("/update/:id", passport.authenticate("jwt-user", { session: false }), updateShippingAddress);
router.delete("/delete/:id", passport.authenticate("jwt-user", { session: false }), deleteShippingAddress);

module.exports = router;
