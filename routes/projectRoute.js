const express = require("express");
const passport = require("passport");
const {
    getAllProject,
    getProjectByCreatorUserId,
    createProject,
    updateProject,
    updateProjectStatusByUser,
    deleteProject,
    getProjectById,
    updateProjectStatusByAdmin,
} = require("../controllers/projectController");
const router = express.Router();

router.get("/get-all", getAllProject);
router.get("/get-by-id/:id", getProjectById);
router.get("/get-by-user-id", passport.authenticate("jwt-user", { session: false }), getProjectByCreatorUserId);
router.post("/create", passport.authenticate("jwt-user", { session: false }), createProject);
router.put("/update/:id", passport.authenticate("jwt-user", { session: false }), updateProject);
router.put("/user-update-status/:id", passport.authenticate("jwt-user", { session: false }), updateProjectStatusByUser);
router.put(
    "/admin-update-status/:id",
    passport.authenticate("jwt-admin", { session: false }),
    updateProjectStatusByAdmin
);
router.delete("/delete/:id", passport.authenticate("jwt-user", { session: false }), deleteProject);

module.exports = router;
