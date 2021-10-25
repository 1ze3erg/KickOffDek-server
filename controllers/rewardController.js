const { Reward, Project } = require("../models");
const CustomErr = require("../helpers/err");
const fs = require("fs");
const util = require("util");
const cloudinary = require("cloudinary").v2;
const uploadPromise = util.promisify(cloudinary.uploader.upload);

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
            limit,
            remaining,
            backerCount,
            estDeliveryMonth,
            estDeliveryYear,
        } = req.body;

        if (!projectId) {
            throw new CustomErr("projectId is required", 400);
        }

        const findReward = await Reward.findOne({ where: { id, projectId } });
        const findProject = await Project.findOne({ where: { id: projectId } });

        if (!findProject) {
            throw new CustomErr("project does not exist", 400);
        }

        if (!findReward) {
            throw new CustomErr("reward does not exist on this project", 400);
        }

        if (findProject?.creatorUserId !== req.user.id) {
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
                limit,
                remaining,
                backerCount,
                estDeliveryMonth,
                estDeliveryYear,
            },
            { where: { id, projectId } }
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
            include: { model: Project, attribute: "createrUserId" },
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
