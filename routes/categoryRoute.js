const express = require("express");
const { getAllCategory, createCategory, updateCategory } = require("../controllers/categoryController");
const router = express.Router();

router.get("/get-all", getAllCategory);
router.post("/create", createCategory);
router.put("/update/:id", updateCategory);

module.exports = router;