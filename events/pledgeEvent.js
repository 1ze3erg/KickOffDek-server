const { Pledge, ShippingAddress, Payment, Reward } = require("../models");
const CustomErr = require("../helpers/err");

async function checkTotalPledgeAmount(socket, pledgeObj, projectId) {
    const { rewardId, shippingAddressId, paymentId, amount, pledgeDate } = pledgeObj;

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

    const findShippingAddress = await ShippingAddress.findOne({
        where: { id: shippingAddressId, userId: socket.request.user.id },
    });
    const findPayment = await Payment.findOne({ where: { id: paymentId, userId: socket.request.user.id } });

    if (!findShippingAddress) {
        throw new CustomErr("shippingAddress not found", 400);
    }

    if (!findPayment) {
        throw new CustomErr("payment not found", 400);
    }

    const findReward = await Reward.findOne({ where: { id: rewardId, projectId } });

    if (!findReward) {
        throw new CustomErr("reward not found", 400);
    }

    const findPledges = await Pledge.findAll({ include: { model: Reward, where: { projectId } } });
    const totalPledgeAmount = findPledges.reduce((total, elem) => total + +elem.amount, 0);

    socket.emit("return-pledge-amount", totalPledgeAmount + amount);
}

module.exports = { checkTotalPledgeAmount };
