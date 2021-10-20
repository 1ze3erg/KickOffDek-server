module.exports = (sequelize, DataTypes) => {
    const ShippingAddress = sequelize.define("ShippingAddress", {
        recipient: {
            type: DataTypes.STRING,
            allowNull: false
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        province: {
            type: DataTypes.STRING,
            allowNull: false
        },
        country: {
            type: DataTypes.STRING,
            allowNull: false
        },
        postalCode: {
            type: DataTypes.STRING,
            allowNull: false
        },
        phoneNumber: {
            type: DataTypes.STRING,
            allowNull: false
        },
    }, {
        tableName: "shipping_addresses",
        underscored: true
    })

    ShippingAddress.associate = (models) => {
        ShippingAddress.belongsTo(models.User, {
            foreignKey: {
                name: "userId",
                allowNull: false,
            },
            onUpdate: "RESTRICT",
            onDelete: "RESTRICT",
        })
    }

    return ShippingAddress;
}