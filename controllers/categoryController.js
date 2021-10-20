const { Category } = require("../models");
const CustomErr = require("../helpers/err");

async function getAllCategory(req, res, next) {
    try {
        const categories = await Category.findAll();
        res.status(200).send(categories);
    } catch (err) {
        next(err);
    }
}

async function createCategory(req, res, next) {
    try {
        const { name } = req.body;

        if (!name || name.trim() === "") {
            throw new CustomErr("name is required", 400);
        }

        const newCategory = await Category.create({ name });

        res.status(201).send(newCategory);
    } catch (err) {
        next(err);
    }
}

async function updateCategory(req, res, next) {
    try {
        const { id } = req.params;
        const { name } = req.body;

        const findCategory = await Category.findOne({ where: { id } });

        if (!findCategory) {
            throw new CustomErr("category not found", 400);
        }

        await Category.update({ name }, { where: { id } });

        res.status(200).send({ msg: "category has been updated" });
    } catch (err) {
        next(err);
    }
}

module.exports = { getAllCategory, createCategory, updateCategory };
