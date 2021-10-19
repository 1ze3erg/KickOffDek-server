const express = require("express");
const { registerUser, checkUserEmail, loginUserWithEmail, loginUserWithGoogle } = require("../controllers/userController");
const router = express.Router();

router.post("/register", registerUser);
router.post("/checkUserEmail", checkUserEmail);
router.post("/loginWithEmail", loginUserWithEmail);
router.post("/loginWithGoogle", loginUserWithGoogle);

module.exports = router;
