const { Pledge, ShippingAddress, Payment, Reward, Project } = require("../models");
const CustomErr = require("../helpers/err");

async function checkTotalPledgeAmount(socket, pledgeObj, projectId) {
    try {
        const { rewardId, shippingAddressId, paymentId, amount, quantity, pledgeDate } = pledgeObj;

        Object.keys(pledgeObj).forEach((elem) => {
            if (!pledgeObj[elem]) {
                throw new CustomErr(`${elem} is required`, 400);
            }
        });

        if (isNaN(amount)) {
            throw new CustomErr("amount must be numeric", 400);
        }

        if (!new Date(pledgeDate).getTime()) {
            throw new CustomErr("pledgeDate must be datetime string", 400);
        }

        const findReward = await Reward.findOne({ where: { id: rewardId, projectId } });
        const findShippingAddress = await ShippingAddress.findOne({
            where: { id: shippingAddressId, userId: socket.request.user.id },
        });
        const findPayment = await Payment.findOne({ where: { id: paymentId, userId: socket.request.user.id } });
        console.log(findReward);

        if (!findReward) {
            throw new CustomErr("reward not found", 400);
        }

        if (!findShippingAddress) {
            throw new CustomErr("shippingAddress not found", 400);
        }

        if (!findPayment) {
            throw new CustomErr("payment not found", 400);
        }

        if (findReward.maxQtyPerPledge < quantity) {
            throw new CustomErr(`You can't pledge more than ${maxQtyPerPledge}`, 400);
        }

        const findPledges = await Pledge.findAll({ include: { model: Reward, where: { projectId } } });
        const totalPledge = findPledges.reduce((total, elem) => total + +elem.amount, 0);

        const newTotalPledgeAmount = totalPledge + amount;

        console.log(newTotalPledgeAmount);

        return newTotalPledgeAmount;
    } catch (err) {
        console.log(err);
    }
}

module.exports = { checkTotalPledgeAmount };
