const express = require("express");
const passport = require("passport");
const {
    getSavedProjectByUserId,
    getSavedProject,
    createSavedProject,
    deleteSavedProject,
} = require("../controllers/savedProjectRoute");
const router = express.Router();

router.get("/get-by-user-id", passport.authenticate("jwt-user", { session: false }), getSavedProjectByUserId);
router.get("/get-one/:projectId", passport.authenticate("jwt-user", { session: false }), getSavedProject);
router.post("/create", passport.authenticate("jwt-user", { session: false }), createSavedProject);
router.delete("/delete/:projectId", passport.authenticate("jwt-user", { session: false }), deleteSavedProject);

module.exports = router;
