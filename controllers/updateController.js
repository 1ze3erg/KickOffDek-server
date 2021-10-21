const { Update, Project } = require("../models");
const CustomErr = require("../helpers/err");

async function getUpdateByProjectId(req, res, next) {
    try {
        const { projectId } = req.params;
        const updates = await Update.findAll({ where: { projectId } });
        res.status(200).send(updates);
    } catch (err) {
        next(err);
    }
}

async function createUpdate(req, res, next) {
    try {
        const { projectId, title, message } = req.body;

        if (!projectId) {
            throw new CustomErr("projectId is required", 400);
        }

        if (!title || title.trim() === "") {
            throw new CustomErr("title is required", 400);
        }

        if (!message || message.trim() === "") {
            throw new CustomErr("message is required", 400);
        }

        const findProject = await Project.findOne({ where: { id: projectId } });

        if (!findProject) {
            throw new CustomErr("project not found", 400);
        }

        if (findProject.creatorUserId !== req.user.id) {
            throw new CustomErr("You are not creator of this project", 400);
        }

        const newUpdate = await Update.create({
            projectId,
            title,
            message,
        });

        res.status(201).send(newUpdate);
    } catch (err) {
        next(err);
    }
}

async function updateUpdate(req, res, next) {
    try {
        const { id } = req.params;
        const { projectId, title, message } = req.body;

        if (!projectId) {
            throw new CustomErr("projectId is required", 400);
        }

        if (!title || title.trim() === "") {
            throw new CustomErr("title is required", 400);
        }

        if (!message || message.trim() === "") {
            throw new CustomErr("message is required", 400);
        }

        const findUpdate = await Update.findOne({
            where: { id },
            include: { model: Project, attribute: "createrUserId" },
        });

        if (!findUpdate) {
            throw new CustomErr("update not found", 400);
        }

        if (findUpdate.Project?.creatorUserId !== req.user.id) {
            throw new CustomErr("You are not creator of this project", 400);
        }

        await Comment.update(
            {
                title,
                message,
            },
            {
                where: { id },
            }
        );

        res.status(200).send({ msg: "comment has been updated" });
    } catch (err) {
        next(err);
    }
}

async function deleteUpdate(req, res, next) {
    try {
        const { id } = req.params;

        const findUpdate = await Update.findOne({
            where: { id },
            include: { model: Project, attribute: "createrUserId" },
        });

        if (!findUpdate) {
            throw new CustomErr("update not found", 400);
        }

        if (findUpdate.Project?.creatorUserId !== req.user.id) {
            throw new CustomErr("You are not creator of this project", 400);
        }

        await Update.destroy({ where: { id } });

        res.status(204).send();
    } catch (err) {
        next(err);
    }
}

module.exports = { getUpdateByProjectId, createUpdate, updateUpdate, deleteUpdate };
