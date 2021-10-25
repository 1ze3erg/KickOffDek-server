const express = require("express");
const passport = require("passport");
const uploadImage = require("../config/upload");
const {
    registerUser,
    checkUserEmail,
    loginUserWithEmail,
    loginUserWithGoogle,
    getUserById,
    updateUser,
} = require("../controllers/userController");
const router = express.Router();

router.get("/get-user", passport.authenticate("jwt-user", { session: false }), getUserById);
router.post("/register", registerUser);
router.post("/check-user-email", checkUserEmail);
router.post("/login-with-email", loginUserWithEmail);
router.post("/login-with-google", loginUserWithGoogle);
router.put(
    "/update-user",
    passport.authenticate("jwt-user", { session: false }),
    uploadImage.single("user-avatar"),
    updateUser
);

module.exports = router;
