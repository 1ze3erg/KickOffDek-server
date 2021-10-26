const { Admin } = require("../models");
const { isStrongPassword } = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const CustomErr = require("../helpers/err");

async function registerAdmin(req, res, next) {
    try {
        const { username, password } = req.body;

        if (!username || username.trim() === "") {
            throw new CustomErr("username is require", 400);
        }

        if (!password || password.trim() === "") {
            throw new CustomErr("password is require", 400);
        }

        if (password.length < 8) {
            throw new CustomErr("password must more than 8 characters", 400);
        }

        const passwordOption = { minLowercase: 0, minUppercase: 0, minNumbers: 0, minSymbols: 0 };

        if (!isStrongPassword(password, { ...passwordOption, minLowercase: 1 })) {
            throw new CustomErr("password must have at least 1 lowercase", 400);
        }

        if (!isStrongPassword(password, { ...passwordOption, minNumbers: 1 })) {
            throw new CustomErr("password must have at least 1 number", 400);
        }

        if (!isStrongPassword(password, { ...passwordOption, minSymbols: 1 })) {
            throw new CustomErr("password must have at least 1 symbol", 400);
        }

        if (!isStrongPassword(password, { ...passwordOption, minUppercase: 1 })) {
            throw new CustomErr("password must have at least 1 uppercase", 400);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newAdmin = await Admin.create({
            username,
            password: hashedPassword,
        });

        res.status(201).send({ msg: `${newAdmin.username} has been created` });
    } catch (err) {
        next(err);
    }
}

async function loginAdmin(req, res, next) {
    try {
        const { username, password } = req.body;

        if (!username || username.trim() === "") {
            throw new CustomErr("username is require", 400);
        }

        if (!password || password.trim() === "") {
            throw new CustomErr("password is require", 400);
        }

        const findAdmin = await Admin.findOne({ where: { username } });
        let isCorrectPassword;
        if (findAdmin) {
            isCorrectPassword = await bcrypt.compare(password, findAdmin.password);
        }

        if (findAdmin && isCorrectPassword) {
            const payload = { id: findAdmin.id, username: findAdmin.username };
            const secretKey = process.env.SECRET_KEY;
            const token = jwt.sign(payload, secretKey, { expiresIn: "3d" });
            res.status(200).send({ msg: `${findAdmin.username} login success`, token, role: "admin" });
        } else {
            throw new CustomErr("username or password is incorrect", 400);
        }
    } catch (err) {
        next(err);
    }
}

module.exports = { registerAdmin, loginAdmin };
