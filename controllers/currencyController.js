const { Currency } = require("../models");
const CustomErr = require("../helpers/err");

async function getAllCurrency(req, res, next) {
    try {
        const currencies = await Currency.findAll();
        res.status(200).send(currencies);
    } catch (err) {
        next(err);
    }
}

async function createCurrency(req, res, next) {
    try {
        const { name } = req.body;

        if (!name || name.trim() === "") {
            throw new CustomErr("name is required", 400);
        }

        if (name.length !== 3) {
            throw new CustomErr("name must have 3 character", 400);
        }

        const newCurrency = await Currency.create({ name: name.toUpperCase() });

        res.status(201).send(newCurrency);
    } catch (err) {
        next(err);
    }
}

async function updateCurrency(req, res, next) {
    try {
        const { id } = req.params;
        const { name } = req.body;

        const findCurrency = await Currency.findOne({ where: { id } });

        if (!findCurrency) {
            throw new CustomErr("currency not found", 400);
        }

        if (!name || name.trim() === "") {
            throw new CustomErr("name is required", 400);
        }

        if (name.length !== 3) {
            throw new CustomErr("name must have 3 character", 400);
        }

        await Currency.update({ name: name.toUpperCase() }, { where: { id } });

        res.status(200).send({ msg: "currency has been updated" });
    } catch (err) {
        next(err);
    }
}

async function deleteCurrency(req, res, next) {
    try {
        const { id } = req.params;

        const findCurrency = await Currency.findOne({ where: { id } });

        if (!findCurrency) {
            throw new CustomErr("currency not found", 400);
        }

        await Currency.destroy({ where: { id } });

        res.status(204).send();
    } catch (err) {
        next(err);
    }
}

module.exports = { getAllCurrency, createCurrency, updateCurrency, deleteCurrency };
