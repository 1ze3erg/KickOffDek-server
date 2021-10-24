const express = require("express");
const passport = require("passport");
const { getAllCategory, createCategory, updateCategory, deleteCategory } = require("../controllers/categoryController");
const router = express.Router();

router.get("/get-all", getAllCategory);
router.post("/create", passport.authenticate("jwt-admin", { session: false }), createCategory);
router.put("/update/:id", passport.authenticate("jwt-admin", { session: false }), updateCategory);
router.delete("/delete/:id", passport.authenticate("jwt-admin", { session: false }), deleteCategory);

module.exports = router;
