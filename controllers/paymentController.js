const { Payment } = require("../models");
const { isNumeric } = require("validator");
const CustomErr = require("../helpers/err");

const monthArr = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];

async function getPaymentByUserId(req, res, next) {
    try {
        const payments = await Payment.findAll({ userId: req.user.id });
        res.status(200).send(payments);
    } catch (err) {
        next(err);
    }
}

async function createPayment(req, res, next) {
    try {
        const { paymentName, cardProvider, cardNumber, cardHolderName, expiration } = req.body;

        const obj = { cardProvider, cardNumber, cardHolderName, expiration };

        Object.keys(obj).forEach((elem) => {
            if (!obj[elem] || obj[elem].trim() === "") {
                throw new CustomErr(`${elem} is required`, 400);
            }
        });

        if (cardProvider !== "VISA" && cardProvider !== "MASTER") {
            throw new CustomErr("cardProvider must be 'VISA' or 'MASTER'", 400);
        }

        if (!isNumeric(cardNumber)) {
            throw new CustomErr("cardNumber must be numeric", 400);
        }

        if (!isNumeric(expiration)) {
            throw new CustomErr("expiration must be numeric", 400);
        }

        if (cardNumber.length !== 16) {
            throw new CustomErr("cardNumber must have 16 character", 400);
        }

        if (expiration.length !== 6) {
            throw new CustomErr("expiration must have 6 character", 400);
        }

        if (!monthArr.includes(expiration.slice(0, 2))) {
            throw new CustomErr("expiration month is invalid", 400);
        }

        if (expiration.slice(0, 2) - 1 < new Date().getMonth() || expiration.slice(2) < new Date().getFullYear()) {
            throw new CustomErr("expiration month or year is passed", 400);
        }

        const newPayment = await Payment.create({
            userId: req.user.id,
            paymentName,
            cardProvider,
            cardNumber,
            cardHolderName,
            expiration,
        });

        res.status(201).send(newPayment);
    } catch (err) {
        next(err);
    }
}

async function updatePayment(req, res, next) {
    try {
        const { id } = req.params;
        const { paymentName, cardProvider, cardNumber, cardHolderName, expiration } = req.body;

        const findPayment = await Payment.findOne({ where: { id, userId: req.user.id } });

        if (!findPayment) {
            throw new CustomErr("payment not found", 400);
        }

        if (cardProvider) {
            if (cardProvider !== "VISA" && cardProvider !== "MASTER") {
                throw new CustomErr("cardProvider must be 'VISA' or 'MASTER'", 400);
            }
        }

        if (cardNumber) {
            if (!isNumeric(cardNumber)) {
                throw new CustomErr("cardNumber must be numeric", 400);
            }

            if (cardNumber.length !== 16) {
                throw new CustomErr("cardNumber must have 16 character", 400);
            }
        }

        if (expiration) {
            if (!isNumeric(expiration)) {
                throw new CustomErr("expiration must be numeric", 400);
            }

            if (expiration.length !== 6) {
                throw new CustomErr("expiration must have 6 character", 400);
            }

            if (!monthArr.includes(expiration.slice(0, 2))) {
                throw new CustomErr("expiration month is invalid", 400);
            }

            if (expiration.slice(0, 2) - 1 < new Date().getMonth() || expiration.slice(2) < new Date().getFullYear()) {
                throw new CustomErr("expiration month or year is passed", 400);
            }
        }

        await Payment.update(
            { paymentName, cardProvider, cardNumber, cardHolderName, expiration },
            { where: { id, userId: req.user.id } }
        );

        res.status(200).send({ msg: "payment has been updated" });
    } catch (err) {
        next(err);
    }
}

async function deletePayment(req, res, next) {
    try {
        const { id } = req.params;

        const findPayment = await Payment.findOne({ where: { id, userId: req.user.id } });

        if (!findPayment) {
            throw new CustomErr("payment not found", 400);
        }

        await Payment.destroy({ where: { id, userId: req.user.id } });

        res.status(204).send();
    } catch (err) {
        next(err);
    }
}

module.exports = { getPaymentByUserId, createPayment, updatePayment, deletePayment };
