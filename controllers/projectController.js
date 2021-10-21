const CustomErr = require("../helpers/err");
const { Project } = require("../models");
const { isDate } = require("validator");

async function getAllProject(req, res, next) {
    try {
        const projects = await Project.findAll();
        res.status(200).send(projects);
    } catch (err) {
        next(err);
    }
}

async function getProjectById(req, res, next) {
    try {
        const { id } = req.params;
        const project = await Project.findOne({ where: { id } });
        res.status(200).send(findProject);
    } catch (err) {
        next(err);
    }
}

async function getProjectByCreatorUserId(req, res, next) {
    try {
        const projects = await Project.findAll({ where: { creatorUserId: req.user.id } });
        res.status(200).send(projects);
    } catch (err) {
        next(err);
    }
}

async function createProject(req, res, next) {
    try {
        const { categoryId, typeId } = req.body;

        if (!categoryId) {
            throw new CustomErr("categoryId is required", 400);
        }

        if (!typeId) {
            throw new CustomErr("typeId is required", 400);
        }

        const newProject = await Project.create({
            categoryId,
            typeId,
            currencyId: 1,
            creatorUserId: req.user.id,
            status: "draft",
        });

        res.status(201).send(newProject);
    } catch (err) {
        next(err);
    }
}

async function updateProject(req, res, next) {
    try {
        const { id } = req.params;
        const {
            title,
            about,
            target,
            startDate,
            endDate,
            organization,
            tagline,
            province,
            country,
            facebook,
            instagram,
            twiiter,
            website,
            coverImage,
            campaignImage,
            campaignStory,
            pitchVideo,
            budgetOverview,
            risk,
            categoryId,
            typeId,
            currencyId,
        } = req.body;

        const findProject = await Project.findOne({ where: { id, creatorUserId: req.user.id } });

        if (!findProject) {
            throw new CustomErr("project not found", 400);
        }

        if (target) {
            if (isNaN(target)) {
                throw new CustomErr("target must be numeric", 400);
            }
        }

        if (startDate) {
            if (!isDate(startDate)) {
                throw new CustomErr("startDate must be datetime string", 400);
            }
        }

        if (endDate) {
            if (!isDate(endDate)) {
                throw new CustomErr("endDate must be datetime string", 400);
            }
        }

        await Project.update(
            {
                title,
                about,
                target,
                startDate,
                endDate,
                organization,
                tagline,
                province,
                country,
                facebook,
                instagram,
                twiiter,
                website,
                coverImage,
                campaignImage,
                pitchVideo,
                campaignStory,
                budgetOverview,
                risk,
                categoryId,
                typeId,
                currencyId,
            },
            { where: { id, creatorUserId: req.user.id } }
        );

        res.status(200).send({ msg: "project has been updated" });
    } catch (err) {
        next(err);
    }
}

async function updateProjectStatusByUser(req, res, next) {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (status !== "review") {
            throw new CustomErr(`user can't update to status ${status}`, 400);
        }

        await Project.update(
            {
                status,
            },
            { where: { id, creatorUserId: req.user.id } }
        );

        res.status(200).send({ msg: "project status has been updated" });
    } catch (err) {
        next(err);
    }
}

async function updateProjectStatusByAdmin(req, res, next) {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (status !== "draft" && status !== "live" && status !== "canceled") {
            throw new CustomErr(`admin can't update to status ${status}`, 400);
        }

        await Project.update(
            {
                status,
            },
            { where: { id } }
        );

        res.status(200).send({ msg: "project status has been updated" });
    } catch (err) {
        next(err);
    }
}

async function deleteProject(req, res, next) {
    try {
        const { id } = req.params;

        const findProject = await Project.findOne({ where: { id, creatorUserId: req.user.id } });

        if (!findProject) {
            throw new CustomErr("project not found", 400);
        }

        await Project.destroy({ where: { id, creatorUserId: req.user.id } });

        res.status(204).send();
    } catch (err) {
        next(err);
    }
}

module.exports = {
    getAllProject,
    getProjectById,
    getProjectByCreatorUserId,
    createProject,
    updateProject,
    updateProjectStatusByUser,
    updateProjectStatusByAdmin,
    deleteProject,
};
