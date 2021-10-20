const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { isEmail, isStrongPassword } = require("validator");
const CustomErr = require("../helpers/err");

async function registerUser(req, res, next) {
    try {
        const { username, email, password } = req.body;

        if (!username || username.trim() === "") {
            throw new CustomErr("username is required", 400);
        }

        if (!email || email.trim() === "") {
            throw new CustomErr("email is required", 400);
        }

        if (!password || password.trim() === "") {
            throw new CustomErr("password is required", 400);
        }

        if (!isEmail(email)) {
            throw new CustomErr("email is invalid", 400);
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

        const newUser = await User.create({
            avatar: `http://localhost:${process.env.PORT}/public/images/default-avatar.png`,
            username,
            email,
            password: hashedPassword,
            loginWith: "email",
        });

        res.status(201).send({ msg: `${newUser.email} has been created` });
    } catch (err) {
        next(err);
    }
}

async function checkUserEmail(req, res, next) {
    try {
        const { email } = req.body;

        const findUser = await User.findOne({ where: { email } });

        if (findUser) {
            if (findUser.loginWith === "google") {
                throw new CustomErr("You already have account by google", 400);
            }
        } else {
            throw new CustomErr("You don't have any account", 400);
        }

        res.status(200).send({ msg: "Let's go to sign in" });
    } catch (err) {
        next(err);
    }
}

async function loginUserWithEmail(req, res, next) {
    try {
        const { email, password } = req.body;

        if (!email || email.trim() === "") {
            throw new CustomErr("email is required", 400);
        }

        if (!password || password.trim() === "") {
            throw new CustomErr("password is required", 400);
        }

        if (!isEmail(email)) {
            throw new CustomErr("email is invalid", 400);
        }

        const findUser = await User.findOne({ where: { email } });
        let isCorrectPassword;
        if (findUser) {
            isCorrectPassword = await bcrypt.compare(password, findUser.password);
        }

        if (findUser && isCorrectPassword) {
            const payload = { id: findUser.id, username: findUser.username };
            const secretKey = process.env.TOKEN_KEY;
            const token = await jwt.sign(payload, secretKey, { expiresIn: "7d" });
            res.status(200).send({ msg: `${findUser.email} login success`, token });
        } else {
            throw new CustomErr("email or password is incorrect", 400);
        }
    } catch (err) {
        next(err);
    }
}

async function loginUserWithGoogle(req, res, next) {
    try {
        const { imageUrl, email, googleId, firstName, lastName } = req.body;

        const findUser = await User.findOne({ where: { email } });

        if (findUser) {
            if (findUser.loginWith === "google") {
                return res.status(200).send({ msg: "You can sign in with google" });
            }
            throw new CustomErr("You already have account by register email", 400);
        }

        const hashedGoogleId = await bcrypt.hash(googleId, 10);

        const newUser = await User.create({
            avatar: imageUrl ?? `http://localhost:${process.env.PORT}/public/images/default-avatar.png`,
            username: email,
            email,
            password: hashedGoogleId,
            firstName,
            lastName,
            loginWith: "google",
        });

        res.status(201).send({ msg: `${newUser.email} has been create` });
    } catch (err) {
        next(err);
    }
}

async function getUserById(req, res, next) {
    try {
        const findUser = await User.findOne({
            where: { id: req.user.id },
            attributes: { exclude: ["id", "password", "loginWith", "createdAt", "updatedAt"] },
        });
        res.status(200).send(findUser);
    } catch (err) {
        next(err);
    }
}

async function updateUser(req, res, next) {
    try {
        const {
            avatar,
            username,
            firstName,
            lastName,
            phoneNumber,
            facebook,
            instagram,
            twitter,
            website,
            province,
            country,
        } = req.body;

        await User.update(
            {
                avatar,
                username,
                firstName,
                lastName,
                phoneNumber,
                facebook,
                instagram,
                // twitter,
                website,
                province,
                country,
            },
            { where: { id: req.user.id } }
        );

        res.status(200).send({ msg: `${req.user.email} has been updated` });
    } catch (err) {
        next(err);
    }
}

module.exports = { registerUser, checkUserEmail, loginUserWithEmail, loginUserWithGoogle, getUserById, updateUser };
