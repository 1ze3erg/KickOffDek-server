const express = require("express");
const passport = require("passport");
const { getRewardByProjectId, createReward, updateReward, deleteReward } = require("../controllers/rewardController");
const router = express.Router();

router.get("/get-by-project-id/:projectId", getRewardByProjectId);
router.post("/create", passport.authenticate("jwt-user", { session: false }), createReward);
router.put("/update/:id", passport.authenticate("jwt-user", { session: false }), updateReward);
router.delete("/delete/:id", passport.authenticate("jwt-user", { session: false }), deleteReward);

module.exports = router;
