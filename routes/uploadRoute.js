const express = require("express");
const passport = require("passport");
const uploadImage = require("../config/upload");
const { createImageUrl, uploadEditorImage } = require("../controllers/uploadController");
const router = express.Router();
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart({ uploadDir: "public/images" });

router.post(
    "/image",
    passport.authenticate("jwt-user", { session: false }),
    uploadImage.single("upload-image"),
    createImageUrl
);
router.post("/editor-image", multipartMiddleware, uploadEditorImage);

module.exports = router;
