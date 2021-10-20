const CustomErr = require("../helpers/err");
const { ShippingAddress } = require("../models");

async function getShippingAddressByUserId(req, res, next) {
    try {
        const addresses = await ShippingAddress.findAll({ where: { userId: req.user.id } });
        res.status(200).send(addresses);
    } catch (err) {
        next(err);
    }
}

async function createShippingAddress(req, res, next) {
    try {
        const { recipient, address, province, country, postalCode, phoneNumber } = req.body;
        const obj = { recipient, address, province, country, postalCode, phoneNumber };

        Object.keys(obj).forEach((elem) => {
            if (!obj[elem] || obj[elem].trim() === "") {
                throw new CustomErr(`${elem} is required`, 400);
            }
        });

        const newAddress = await ShippingAddress.create({
            recipient,
            address,
            province,
            country,
            postalCode,
            phoneNumber,
            userId: req.user.id,
        });

        res.status(201).send(newAddress);
    } catch (err) {
        next(err);
    }
}

async function updateShippingAddress(req, res, next) {
    try {
        const { id } = req.params;
        const { recipient, address, province, country, postalCode, phoneNumber } = req.body;

        const findAddress = await ShippingAddress.findOne({ where: { id, userId: req.user.id } });

        if (!findAddress) {
            throw new CustomErr("shipping address not found", 400);
        }

        await ShippingAddress.update(
            {
                recipient,
                address,
                province,
                country,
                postalCode,
                phoneNumber,
            },
            { where: { id, userId: req.user.id } }
        );

        res.status(200).send("shipping address has been updated");
    } catch (err) {
        next(err);
    }
}

async function deleteShippingAddress(req, res, next) {
    try {
        const { id } = req.params;

        const findAddress = await ShippingAddress.findOne({ where: { id, userId: req.user.id } });

        if (!findAddress) {
            throw new CustomErr("shipping address not found", 400);
        }

        await ShippingAddress.destroy({ where: { id, userId: req.user.id } });

        res.status(204).send();
    } catch (err) {
        next(err);
    }
}

module.exports = { getShippingAddressByUserId, createShippingAddress, updateShippingAddress, deleteShippingAddress };
