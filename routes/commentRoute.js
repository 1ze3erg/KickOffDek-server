const express = require("express");
const passport = require("passport");
const { getCommentByProjectId, createCommentByUser, updateCommentByUser, deleteCommentByUser } = require("../controllers/commentController");
const router = express.Router();

router.get("/get-by-project-id/:projectId", getCommentByProjectId);
router.post("/create", passport.authenticate("jwt-user", { session: false }), createCommentByUser);
router.put("/update/:id", passport.authenticate("jwt-user", { session: false }), updateCommentByUser);
router.delete("/delete/:id", passport.authenticate("jwt-user", { session: false }), deleteCommentByUser);

module.exports = router;
