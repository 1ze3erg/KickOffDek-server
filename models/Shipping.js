module.exports = (sequelize, DataTypes) => {
    const Shipping = sequelize.define(
        "Shipping",
        {
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            fee: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
        },
        {
            tableName: "shippings",
            underscored: true,
        }
    );

    Shipping.associate = (models) => {
        Shipping.belongsTo(models.Reward, {
            foreignKey: {
                name: "rewardId",
                allowNull: false,
            },
            onUpdate: "RESTRICT",
            onDelete: "RESTRICT",
        });
    };

    return Shipping;
};
