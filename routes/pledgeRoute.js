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

router.get("/get-all", getAllPledge);
router.get(
    "/get-by-project-id/:projectId",
    passport.authenticate("jwt-user", { session: false }),
    getPledgeByProjectId
);
router.get("/get-by-user-id", passport.authenticate("jwt-user", { session: false }), getPledgeByUserId);
router.post("/create", passport.authenticate("jwt-user", { session: false }), createPledge);
router.put("/update-status", updatePledgeStatus);

module.exports = router;
