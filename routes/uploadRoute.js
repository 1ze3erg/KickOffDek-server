const express = require("express");
const passport = require("passport");
const uploadImage = require("../config/upload");
const { createImageUrl } = require("../controllers/uploadController");
const router = express.Router();

router.post(
    "/image",
    passport.authenticate("jwt-user", { session: false }),
    uploadImage.single("upload-image"),
    createImageUrl
);

module.exports = router;
