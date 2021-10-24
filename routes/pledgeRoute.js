const express = require("express");
const passport = require("passport");
const {
    getAllPledge,
    getPledgeByProjectId,
    getPledgeByUserId,
    createPledge,
    updatePledgeStatus,
} = require("../controllers/pledgeController");
const router = express.Router();

router.get("/get-all", passport.authenticate("jwt-admin", { session: false }), getAllPledge);
router.get(
    "/get-by-project-id/:projectId",
    passport.authenticate("jwt-user", { session: false }),
    getPledgeByProjectId
);
router.get("/get-by-user-id", passport.authenticate("jwt-user", { session: false }), getPledgeByUserId);
router.post("/create", passport.authenticate("jwt-user", { session: false }), createPledge);
router.put("/update-status", passport.authenticate("jwt-admin", { session: false }), updatePledgeStatus);

module.exports = router;
