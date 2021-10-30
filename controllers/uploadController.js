const CustomErr = require("../helpers/err");
const fs = require("fs");
const util = require("util");
const cloudinary = require("cloudinary").v2;
const uploadPromise = util.promisify(cloudinary.uploader.upload);

async function createImageUrl(req, res, next) {
    try {
        if (!req.file) {
            throw new CustomErr("image file is required", 400);
        }

        console.log(req.file);
        const result = await uploadPromise(req.file.path);
        fs.unlinkSync(req.file.path);

        res.status(201).send({ imageUrl: result.secure_url });
    } catch (err) {
        next(err);
    }
}

module.exports = { createImageUrl };
