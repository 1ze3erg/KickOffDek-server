const express = require("express");
const passport = require("passport");
const { getAllType, createType, updateType, deleteType } = require("../controllers/typeController");
const router = express.Router();

router.get("/get-all", getAllType);
router.post("/create", passport.authenticate("jwt-admin", { session: false }), createType);
router.put("/update/:id", passport.authenticate("jwt-admin", { session: false }), updateType);
router.delete("/delete/:id", passport.authenticate("jwt-admin", { session: false }), deleteType);

module.exports = router;