module.exports = (sequelize, DataTypes) => {
    const Currency = sequelize.define(
        "Currency",
        {
            name: {
                type: DataTypes.STRING(3),
                validate: {
                    isUppercase: true,
                    isLengthThree(value) {
                        if (value.length !== 3) {
                            throw new CustomErr("currency must have 3 character", 400);
                        }
                    },
                },
            },
        },
        {
            tableName: "currencies",
            underscored: true,
        }
    );

    Currency.associate = (models) => {
        Currency.hasMany(models.Project, {
            foreignKey: {
                name: "currencyId",
                allowNull: false,
            },
            onUpdate: "RESTRICT",
            onDelete: "RESTRICT",
        });
    };

    return Currency;
};
