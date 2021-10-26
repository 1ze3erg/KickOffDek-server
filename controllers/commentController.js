const { Comment, Project } = require("../models");
const CustomErr = require("../helpers/err");

async function getCommentByProjectId(req, res, next) {
    try {
        const { projectId } = req.params;
        const comments = await Comment.findAll({ where: { projectId } });
        res.status(200).send(comments);
    } catch (err) {
        next(err);
    }
}

async function createComment(req, res, next) {
    try {
        const { projectId, message } = req.body;

        if (!projectId) {
            throw new CustomErr("projectId is required", 400);
        }

        if (!message || message.trim() === "") {
            throw new CustomErr("message is required", 400);
        }

        const findProject = await Project.findOne({ where: { id: projectId } });

        if (!findProject) {
            throw new CustomErr("project not found", 400);
        }

        const newComment = await Comment.create({
            userId: req.user.id,
            projectId,
            message,
        });

        res.status(201).send(newComment);
    } catch (err) {
        next(err);
    }
}

async function updateComment(req, res, next) {
    try {
        const { id } = req.params;
        const { message } = req.body;

        const findComment = await Comment.findOne({ where: { id } });

        if (!findComment) {
            throw new CustomErr("comment not dound", 400);
        }
        
        if (findComment.userId !== req.user.id) {
            throw new CustomErr("You can't update this comment", 400);
        }

        await Comment.update(
            {
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

async function deleteComment(req, res, next) {
    try {
        const { id } = req.params;

        const findComment = await Comment.findOne({ where: { id } });

        if (!findComment) {
            throw new CustomErr("comment not dound", 400);
        }
        
        if (findComment.userId !== req.user.id) {
            throw new CustomErr("You can't delete this comment", 400);
        }

        await Comment.destroy({ where: { id } });

        res.status(204).send();
    } catch (err) {
        next(err);
    }
}

module.exports = { getCommentByProjectId, createComment, updateComment, deleteComment };
