module.exports = (sequelize, DataTypes) => {
    const Pledge = sequelize.define(
        "Pledge",
        {
            userId: {
                primaryKey: true,
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            rewardId: {
                primaryKey: true,
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            amount: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
            pledgeDate: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            status: {
                type: DataTypes.ENUM("charged", "not charged", "canceled"),
                allowNull: false,
            },
        },
        {
            tableName: "pledges",
            underscored: true,
        }
    );

    Pledge.associate = (models) => {
        Pledge.belongsTo(models.Reward, {
            foreignKey: {
                name: "rewardId",
                allowNull: false,
            },
            onFaq: "RESTRICT",
            onDelete: "RESTRICT",
        });

        Pledge.belongsTo(models.ShippingAddress, {
            foreignKey: {
                name: "shippingAddressId",
                allowNull: false,
            },
            onFaq: "RESTRICT",
            onDelete: "RESTRICT",
        });

        Pledge.belongsTo(models.Payment, {
            foreignKey: {
                name: "paymentId",
                allowNull: false,
            },
            onFaq: "RESTRICT",
            onDelete: "RESTRICT",
        });
    };

    return Pledge;
};