const express = require("express");
const { getAllType, createType, updateType, deleteType } = require("../controllers/typeController");
const router = express.Router();

router.get("/get-all", getAllType);
router.post("/create", createType);
router.put("/update/:id", updateType);
router.delete("/delete/:id", deleteType);

module.exports = router;