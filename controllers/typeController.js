const { Type } = require("../models");
const CustomErr = require("../helpers/err");

async function getAllType(req, res, next) {
    try {
        const types = await Type.findAll();
        res.status(200).send(types);
    } catch (err) {
        next(err);
    }
}

async function createType(req, res, next) {
    try {
        const { name } = req.body;

        if (!name || name.trim() === "") {
            throw new CustomErr("name is required", 400);
        }

        const newType = await Type.create({ name });

        res.status(201).send(newType);
    } catch (err) {
        next(err);
    }
}

async function updateType(req, res, next) {
    try {
        const { id } = req.params;
        const { name } = req.body;

        const findType = await Type.findOne({ where: { id } });

        if (!findType) {
            throw new CustomErr("type not found", 400);
        }

        await Type.update({ name }, { where: { id } });

        res.status(200).send({ msg: "type has been updated" });
    } catch (err) {
        next(err);
    }
}

async function deleteType(req, res, next) {
    try {
        const { id } = req.params;

        const findType = await Type.findOne({ where: { id } });

        if (!findType) {
            throw new CustomErr("type not found", 400);
        }

        await Type.destroy({ where: { id } });
        
        res.status(204).send();
    } catch (err) {
        next(err);
    }
}

module.exports = { getAllType, createType, updateType, deleteType };
