const express = require("express");
const passport = require("passport");
const {
    registerUser,
    checkUserEmail,
    loginUserWithEmail,
    loginUserWithGoogle,
} = require("../controllers/userController");
const router = express.Router();

router.post("/register", registerUser);
router.post("/checkUserEmail", checkUserEmail);
router.post("/loginWithEmail", loginUserWithEmail);
router.post("/loginWithGoogle", loginUserWithGoogle);
router.put("/update", passport.authenticate("jwt-user", { session: false }), (req, res) => {
    res.send(req.user);
});

module.exports = router;
