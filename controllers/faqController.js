const { Faq, Project } = require("../models");
const CustomErr = require("../helpers/err");

async function getFaqByProjectId(req, res, next) {
    try {
        const { projectId } = req.params;
        const faqs = await Faq.findAll({ where: { projectId } });
        res.status(200).send(faqs);
    } catch (err) {
        next(err);
    }
}

async function createFaq(req, res, next) {
    try {
        const { projectId, question, anwser } = req.body;

        if (!projectId) {
            throw new CustomErr("projectId is required", 400);
        }

        if (!question || question.trim() === "") {
            throw new CustomErr("question is required", 400);
        }

        if (!anwser || anwser.trim() === "") {
            throw new CustomErr("anwser is required", 400);
        }

        const findProject = await Project.findOne({ where: { id: projectId } });

        if (!findProject) {
            throw new CustomErr("project not found", 400);
        }

        if (findProject.creatorUserId !== req.user.id) {
            throw new CustomErr("You are not creator of this project", 400);
        }

        const newFaq = await Faq.create({
            projectId,
            question,
            anwser,
        });

        res.status(201).send(newFaq);
    } catch (err) {
        next(err);
    }
}

async function updateFaq(req, res, next) {
    try {
        const { id } = req.params;
        const { question, anwser } = req.body;

        const findFaq = await Faq.findOne({
            where: { id },
            include: { model: Project, attributes: ["creatorUserId"] },
        });

        if (!findFaq) {
            throw new CustomErr("Faq not found", 400);
        }

        if (findFaq.Project?.creatorUserId !== req.user.id) {
            throw new CustomErr("You are not creator of this project", 400);
        }

        await Faq.update(
            {
                question,
                anwser,
            },
            {
                where: { id },
            }
        );

        res.status(200).send({ msg: "Faq has been update" });
    } catch (err) {
        next(err);
    }
}

async function deleteFaq(req, res, next) {
    try {
        const { id } = req.params;

        const findFaq = await Faq.findOne({
            where: { id },
            include: { model: Project, attributes: ["creatorUserId"] },
        });

        if (!findFaq) {
            throw new CustomErr("Faq not found", 400);
        }

        if (findFaq.Project?.creatorUserId !== req.user.id) {
            throw new CustomErr("You are not creator of this project", 400);
        }

        await Faq.destroy({ where: { id } });

        res.status(204).send();
    } catch (err) {
        next(err);
    }
}

module.exports = { getFaqByProjectId, createFaq, updateFaq, deleteFaq };