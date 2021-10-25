const { Pledge, Reward, ShippingAddress, Payment } = require("../models");
const CustomErr = require("../helpers/err");

async function getAllPledge(req, res, next) {
    try {
        const pledges = await Pledge.findAll();
        res.status(200).send(pledges);
    } catch (err) {
        next(err);
    }
}

async function getPledgeByProjectId(req, res, next) {
    try {
        const { projectId } = req.params;
        const pledges = await Pledge.findAll({ include: { model: Reward, where: { projectId } } });
        res.status(200).send(pledges);
    } catch (err) {
        next(err);
    }
}

async function getPledgeByUserId(req, res, next) {
    try {
        const pledges = await Pledge.findAll({ where: { userId: req.user.id } });
        res.status(200).send(pledges);
    } catch (err) {
        next(err);
    }
}

async function createPledge(req, res, next) {
    try {
        const { rewardId, shippingAddressId, paymentId, amount, pledgeDate } = req.body;

        const obj = { rewardId, shippingAddressId, paymentId, amount, pledgeDate };

        Object.keys(obj).forEach((elem) => {
            if (!obj[elem]) {
                throw new CustomErr(`${elem} is required`, 400);
            }
        });

        if (isNaN(amount)) {
            throw new CustomErr("amount must be numeric", 400);
        }

        if (!new Date(pledgeDate).getTime()) {
            throw new CustomErr("pledgeDate must be datetime string", 400);
        }

        const findShippingAddress = await ShippingAddress.findOne({
            where: { id: shippingAddressId, userId: req.user.id },
        });
        const findPayment = await Payment.findOne({ where: { id: paymentId, userId: req.user.id } });

        if (!findShippingAddress) {
            throw new CustomErr("shippingAddress not found", 400);
        }

        if (!findPayment) {
            throw new CustomErr("payment not found", 400);
        }

        const findReward = await Reward.findOne({ where: { id: rewardId } });

        if (!findReward) {
            throw new CustomErr("reward not found", 400);
        }

        const newPledge = await Pledge.create({
            userId: req.user.id,
            rewardId,
            shippingAddressId,
            paymentId,
            amount,
            pledgeDate,
            status: "not charged",
        });

        res.status(201).send(newPledge);
    } catch (err) {
        next(err);
    }
}

async function updatePledgeStatus(req, res, next) {
    try {
        const { userId, rewardId, status } = req.body;

        if (!userId) {
            throw new CustomErr("userId is required", 400);
        }

        if (!rewardId) {
            throw new CustomErr("rewardId is required", 400);
        }

        if (!status || status.trim() === "") {
            throw new CustomErr("status is required", 400);
        }

        const findPledge = await Pledge.findOne({ where: { userId, rewardId } });

        if (!findPledge) {
            throw new CustomErr("pledge not found", 400);
        }

        if (status !== "canceled") {
            throw new CustomErr(`admin can't update to status ${status}`, 400);
        }

        await Pledge.update({ status }, { where: { userId, rewardId } });

        res.status(200).send({ msg: "pledge status has been updated" });
    } catch (err) {
        next(err);
    }
}

module.exports = {
    getAllPledge,
    getPledgeByProjectId,
    getPledgeByUserId,
    createPledge,
    updatePledgeStatus,
};
