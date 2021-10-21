const express = require("express");
const passport = require("passport");
const router = express.Router();

router.get("/get-by-project-id/:projectId", getUpdateByProjectId);
router.post("/create", passport.authenticate("jwt-user", { session: false }), createUpdate);
router.put("/update/:id", passport.authenticate("jwt-user", { session: false }), updateUpdate);
router.delete("/delete/:id", passport.authenticate("jwt-user", { session: false }), deleteUpdate);

module.exports = router;