const express = require("express");
const { getAllCategory, createCategory, updateCategory, deleteCategory } = require("../controllers/categoryController");
const router = express.Router();

router.get("/get-all", getAllCategory);
router.post("/create", createCategory);
router.put("/update/:id", updateCategory);
router.delete("/delete/:id", deleteCategory);

module.exports = router;
