const express = require("express");
const passport = require("passport");
const { getCommentByProjectId, createComment, updateComment, deleteComment } = require("../controllers/commentController");
const router = express.Router();

router.get("/get-by-project-id/:projectId", getCommentByProjectId);
router.post("/create", passport.authenticate("jwt-user", { session: false }), createComment);
router.put("/update/:id", passport.authenticate("jwt-user", { session: false }), updateComment);
router.delete("/delete/:id", passport.authenticate("jwt-user", { session: false }), deleteComment);

module.exports = router;
