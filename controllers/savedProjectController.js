const CustomErr = require("../helpers/err");
const { SavedProject, Project } = require("../models");

async function getSavedProjectByUserId(req, res, next) {
    try {
        const savedProjects = await SavedProject.findAll({ where: { userId: req.user.id } });
        res.status(200).send(savedProjects);
    } catch (err) {
        next(err);
    }
}

async function getSavedProject(req, res, next) {
    try {
        const { projectId } = req.params;
        const savedProject = await SavedProject.findOne({ where: { userId: req.user.id, projectId } });
        res.status(200).send(savedProject);
    } catch (err) {
        next(err);
    }
}

async function createSavedProject(req, res, next) {
    try {
        const { projectId } = req.body;

        if (!projectId) {
            throw new CustomErr("projectId is required", 400);
        }

        const findProject = await Project.findOne({ where: { id: projectId } });

        if (!findProject) {
            throw new CustomErr("project not found", 400);
        }

        const newSavedProject = await SavedProject.create({
            userId: req.user.id,
            projectId,
        });

        res.status(201).send(newSavedProject);
    } catch (err) {
        next(err);
    }
}

async function deleteSavedProject(req, res, next) {
    try {
        const { projectId } = req.params;

        const findSavedProject = await SavedProject.findOne({ where: { userId: req.user.id, projectId } });

        if (!findSavedProject) {
            throw new CustomErr("savedProject not found", 400);
        }

        await SavedProject.destroy({ where: { userId: req.user.id, projectId } });

        res.status(204).send();
    } catch (err) {
        next(err);
    }
}

module.exports = { getSavedProjectByUserId, getSavedProject, createSavedProject, deleteSavedProject };
