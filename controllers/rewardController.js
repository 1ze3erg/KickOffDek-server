const { Reward, Project } = require("../models");
const CustomErr = require("../helpers/err");
const fs = require("fs");
const util = require("util");
const cloudinary = require("cloudinary").v2;
const uploadPromise = util.promisify(cloudinary.uploader.upload);

const monthArr = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

async function getRewardByProjectId(req, res, next) {
    try {
        const { projectId } = req.params;
        const rewards = await Reward.findAll({ where: { projectId } });
        res.status(200).send(rewards);
    } catch (err) {
        next(err);
    }
}

async function getRewardById(req, res, next) {
    try {
        const { id } = req.params;
        const reward = await Reward.findOne({ where: { id } });
        res.status(200).send(reward);
    } catch (err) {
        next(err);
    }
}

async function createReward(req, res, next) {
    try {
        const {
            projectId,
            title,
            description,
            image,
            minAmount,
            maxQtyPerPledge,
            limit,
            estDeliveryMonth,
            estDeliveryYear,
        } = req.body;

        if (!projectId) {
            throw new CustomErr("projectId is required", 400);
        }

        if (!title || title.trim() === "") {
            throw new CustomErr("title is required", 400);
        }

        if (!description || description.trim() === "") {
            throw new CustomErr("description is required", 400);
        }

        if (!minAmount) {
            throw new CustomErr("minAmount is required", 400);
        }

        if (minAmount < 1) {
            throw new CustomErr("minAmount must more than 1", 400);
        }

        if (!estDeliveryMonth) {
            throw new CustomErr("estDeliveryMonth is required", 400);
        }

        if (estDeliveryMonth.length !== 3) {
            throw new CustomErr("estDeliveryMonth must have 3 character", 400);
        }

        if (!monthArr.includes(estDeliveryMonth)) {
            throw new CustomErr("estDeliveryMonth is invalid", 400);
        }

        if (!estDeliveryYear) {
            throw new CustomErr("estDeliveryYear is required", 400);
        }

        if (estDeliveryYear <= new Date().getFullYear()) {
            if (estDeliveryYear < new Date().getFullYear()) {
                throw new CustomErr("estDelivery is passed", 400);
            } else if (
                estDeliveryYear === new Date().getFullYear() &&
                monthArr.findIndex((elem) => elem === estDeliveryMonth) < new Date().getMonth()
            ) {
                throw new CustomErr("estDelivery is passed", 400);
            }
        }

        const findProject = await Project.findOne({ where: { id: projectId } });

        if (!findProject) {
            throw new CustomErr("project not found", 400);
        }

        if (findProject?.creatorUserId !== req.user.id) {
            throw new CustomErr("You are not creator of this project", 400);
        }

        const newReward = await Reward.create({
            projectId,
            title,
            description,
            image,
            minAmount,
            maxQtyPerPledge,
            limit,
            remaining: limit,
            estDeliveryMonth,
            estDeliveryYear,
        });

        res.status(201).send(newReward);
    } catch (err) {
        next(err);
    }
}

async function updateReward(req, res, next) {
    try {
        const { id } = req.params;
        const {
            projectId,
            title,
            description,
            image,
            minAmount,
            maxQtyPerPledge,
            limit,
            remaining,
            backerCount,
            estDeliveryMonth,
            estDeliveryYear,
        } = req.body;

        if (!projectId) {
            throw new CustomErr("projectId is required", 400);
        }

        if (estDeliveryMonth && estDeliveryYear) {
            if (estDeliveryMonth.length !== 3) {
                throw new CustomErr("estDeliveryMonth must have 3 character", 400);
            }

            if (!monthArr.includes(estDeliveryMonth)) {
                throw new CustomErr("estDeliveryMonth is invalid", 400);
            }

        if (estDeliveryYear && estDeliveryMonth) {
            if (estDeliveryYear <= new Date().getFullYear()) {
                if (estDeliveryYear < new Date().getFullYear()) {
                    throw new CustomErr("estDelivery is passed", 400);
                } else if (
                    estDeliveryYear === new Date().getFullYear() &&
                    monthArr.findIndex((elem) => elem === estDeliveryMonth) < new Date().getMonth()
                ) {
                    throw new CustomErr("estDelivery is passed", 400);
                }
            }
        }

        const findReward = await Reward.findOne({
            where: { id },
            include: { model: Project, where: { id: projectId }, attributes: ["creatorUserId"] },
        });

        if (!findReward) {
            throw new CustomErr("reward not found on this project", 400);
        }

        if (findReward.Project?.creatorUserId !== req.user.id) {
            throw new CustomErr("You are not creator of this project", 400);
        }

        await Reward.update(
            {
                title,
                description,
                image,
                minAmount,
                maxQtyPerPledge,
                limit,
                remaining,
                backerCount,
                estDeliveryMonth,
                estDeliveryYear,
            },
            { where: { id } }
        );

        res.status(200).send({ msg: "reward has been updated" });
    } catch (err) {
        next(err);
    }
}

async function deleteReward(req, res, next) {
    try {
        const { id } = req.params;

        const findReward = await Reward.findOne({
            where: { id },
            include: { model: Project, attributes: ["creatorUserId"] },
        });

        if (!findReward) {
            throw new CustomErr("reward not found", 400);
        }

        if (findReward.Project?.creatorUserId !== req.user.id) {
            throw new CustomErr("You are not creator of this project", 400);
        }

        await Reward.destroy({ where: { id } });

        res.status(204).send();
    } catch (err) {
        next(err);
    }
}

module.exports = { getRewardByProjectId, getRewardById, createReward, updateReward, deleteReward };
