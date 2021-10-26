const CustomErr = require("../helpers/err");
const { Shipping, Reward, Project } = require("../models");

async function getShippingRewardId(req, res, next) {
    try {
        const { rewardId } = req.params;
        const shippings = await Shipping.findAll({ where: { rewardId } });
        res.status(200).send(shippings);
    } catch (err) {
        next(err);
    }
}

async function createShipping(req, res, next) {
    try {
        const { rewardId, name, fee } = req.body;

        if (!rewardId) {
            throw new CustomErr("rewardId is required", 400);
        }

        if (!name || name.trim() === "") {
            throw new CustomErr("name is required", 400);
        }

        if (!fee) {
            throw new CustomErr("fee is required", 400);
        }

        if (isNaN(fee)) {
            throw new CustomErr("fee must be numeric", 400);
        }

        const findReward = await Reward.findOne({ where: { id: rewardId }, include: { model: Project } });

        if (!findReward) {
            throw new CustomErr("reward not found", 400);
        }

        if (findReward.Project?.creatorUserId !== req.user.id) {
            throw new CustomErr("You are not creator of this project", 400);
        }

        const newShipping = await Shipping.create({
            rewardId,
            name,
            fee,
        });

        res.status(201).send(newShipping);
    } catch (err) {
        next(err);
    }
}

async function updateShipping(req, res, next) {
    try {
        const { id } = req.params;
        const { rewardId, name, fee } = req.body;

        if (!rewardId) {
            throw new CustomErr("rewardId is required", 400);
        }

        if (fee) {
            if (isNaN(fee)) {
                throw new CustomErr("fee must be numeric", 400);
            }
        }

        const findShipping = await Shipping.findOne({
            where: { id },
            include: { model: Reward, include: { model: Project, attributes: ["creatorUserId"] } },
        });

        if (!findShipping) {
            throw new CustomErr("shipping not found", 400);
        }

        if (findShipping.Reward?.id !== rewardId) {
            throw new CustomErr("shipping not found on this reward", 400);
        }

        if (findShipping.Reward?.Project?.creatorUserId !== req.user.id) {
            throw new CustomErr("You are not creator of this project", 400);
        }

        await Shipping.update(
            {
                name,
                fee,
            },
            {
                where: { id },
            }
        );

        res.status(200).send({ msg: "shipping has been updated" });
    } catch (err) {
        next(err);
    }
}

async function deleteShipping(req, res, next) {
    try {
        const { id } = req.params;

        const findShipping = await Shipping.findOne({
            where: { id },
            include: { model: Reward, include: { model: Project, attributes: ["creatorUserId"] } },
        });

        if (!findShipping) {
            throw new CustomErr("shipping not found", 400);
        }

        if (findShipping.Reward?.Project?.creatorUserId !== req.user.id) {
            throw new CustomErr("You are not creator of this project", 400);
        }

        await Shipping.destroy({ where: { id } });

        res.status(204).send();
    } catch (err) {
        next(err);
    }
}

module.exports = { getShippingRewardId, createShipping, updateShipping, deleteShipping };
