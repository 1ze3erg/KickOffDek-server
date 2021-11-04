const CustomErr = require("../helpers/err");
const { Project, Category, Currency, Type } = require("../models");

async function getAllProject(req, res, next) {
    try {
        const projects = await Project.findAll({ include: [Category, Currency, Type] });
        res.status(200).send(projects);
    } catch (err) {
        next(err);
    }
}

async function getProjectById(req, res, next) {
    try {
        const { id } = req.params;
        const project = await Project.findOne({ where: { id }, include: [Category, Currency, Type] });
        res.status(200).send(project);
    } catch (err) {
        next(err);
    }
}

async function getProjectByCreatorUserId(req, res, next) {
    try {
        const projects = await Project.findAll({
            where: { creatorUserId: req.user.id },
            include: [Category, Currency, Type],
        });
        res.status(200).send(projects);
    } catch (err) {
        next(err);
    }
}

async function createProject(req, res, next) {
    try {
        const {
            categoryId,
            typeId,
            currencyId,
            title,
            about,
            target,
            endDate,
            organization,
            tagline,
            province,
            country,
            facebook,
            instagram,
            twitter,
            website,
            coverImage,
            campaignImage,
        } = req.body;

        const obj = {
            title,
            target,
            endDate,
            organization,
            tagline,
            coverImage,
            campaignImage,
        };

        if (!categoryId) {
            throw new CustomErr("typeId is required", 400);
        }

        if (!typeId) {
            throw new CustomErr("typeId is required", 400);
        }

        if (!currencyId) {
            throw new CustomErr("currencyId is required", 400);
        }

        Object.keys(obj).forEach((elem) => {
            if (!obj[elem] || obj[elem].trim() === "") {
                throw new CustomErr(`${elem} is required`, 400);
            }
        });

        if (!target) {
            throw new CustomErr("target is required", 400);
        }

        if (isNaN(target)) {
            throw new CustomErr("target must be numeric", 400);
        }

        if (!new Date(endDate).getTime()) {
            throw new CustomErr("endDate must be datetime string", 400);
        }

        const findType = await Type.findOne({ where: { id: typeId } });
        const findCurrency = await Currency.findOne({ where: { id: currencyId } });

        if (!findType) {
            throw new CustomErr("type not found", 400);
        }

        if (!findCurrency) {
            throw new CustomErr("currency not found", 400);
        }

        const category = await Category.findAll();

        const newProject = await Project.create({
            categoryId,
            typeId,
            currencyId,
            creatorUserId: req.user.id,
            title,
            about,
            status: "draft",
            target,
            endDate,
            organization,
            tagline,
            province,
            country,
            facebook,
            instagram,
            twitter,
            website,
            coverImage,
            campaignImage,
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
            twitter,
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

        if (target) {
            if (isNaN(+target)) {
                throw new CustomErr("target must be numeric", 400);
            }
        }

        if (startDate) {
            if (!new Date(startDate).getTime()) {
                throw new CustomErr("startDate must be datetime string", 400);
            }
        }

        if (endDate) {
            if (!new Date(endDate).getTime()) {
                throw new CustomErr("endDate must be datetime string", 400);
            }
        }

        const findProject = await Project.findOne({ where: { id } });

        if (!findProject) {
            throw new CustomErr("project not found", 400);
        }

        if (findProject.creatorUserId !== req.user.id) {
            throw new CustomErr("You are not creator of this project", 400);
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
                twitter,
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

        if (!status || status.trim() === "") {
            throw new CustomErr("status is required", 400);
        }

        if (status !== "review") {
            throw new CustomErr(`user can't update to status ${status}`, 400);
        }

        const findProject = await Project.findOne({ where: { id } });

        if (!findProject) {
            throw new CustomErr("project not found", 400);
        }

        if (findProject.creatorUserId !== req.user.id) {
            throw new CustomErr("You are not creator of this project", 400);
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

        if (!status || status.trim() === "") {
            throw new CustomErr("status is required", 400);
        }

        if (status !== "draft" && status !== "live" && status !== "canceled") {
            throw new CustomErr(`admin can't update to status ${status}`, 400);
        }

        const findProject = await Project.findOne({ where: { id } });

        if (!findProject) {
            throw new CustomErr("project not found", 400);
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

        if (findProject.status !== "draft") {
            throw new CustomErr("You are not creator of this project", 400);
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
