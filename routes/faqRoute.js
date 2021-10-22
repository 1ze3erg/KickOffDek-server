const express = require("express");
const { getFaqByProjectId, createFaq, updateFaq, deleteFaq } = require("../controllers/faqController");
const router = express.Router();

router.get("/get-by-project-id/:projectId", getFaqByProjectId);
router.post("/create", passport.authenticate("jwt-user", { session: false }), createFaq);
router.put("/update/:id", passport.authenticate("jwt-user", { session: false }), updateFaq);
router.delete("/delete/:id", passport.authenticate("jwt-user", { session: false }), deleteFaq);

module.exports = router;
