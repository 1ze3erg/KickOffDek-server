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

async function createReward(req, res, next) {
    try {
        const { projectId } = req.body;

        if (!projectId) {
            throw new CustomErr("projectId is required", 400);
        }

        const findProject = await Project.findOne({ where: { id: projectId } });

        if (!findProject) {
            throw new CustomErr("project does not exist", 400);
        }

        if (findProject?.creatorUserId !== req.user.id) {
            throw new CustomErr("You are not creator of this project", 400);
        }

        const newReward = await Reward.create({
            projectId,
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
            minPledge,
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

        if (estDeliveryMonth) {
            if (estDeliveryMonth.length !== 3) {
                throw new CustomErr("estDeliveryMonth must have 3 character", 400);
            }

            if (monthArr.includes(estDeliveryMonth)) {
                throw new CustomErr("estDeliveryMonth is invalid", 400);
            }

            if (monthArr.findIndex((elem) => elem === estDeliveryMonth) < new Date().getMonth()) {
                throw new CustomErr("estDeliveryMonth is passed", 400);
            }
        }

        if (estDeliveryYear) {
            if (estDeliveryMonth < new Date().getFullYear()) {
                throw new CustomErr("estDeliveryYear is passed", 400);
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

        let result;
        if (req.file) {
            console.log(req.file);
            result = await uploadPromise(req.file.path);
            fs.unlinkSync(req.file.path);
        }

        await Reward.update(
            {
                title,
                description,
                image: result?.secure_url,
                minPledge,
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

module.exports = { getRewardByProjectId, createReward, updateReward, deleteReward };
