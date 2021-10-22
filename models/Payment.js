module.exports = (sequelize, DataTypes) => {
    const Payment = sequelize.define(
        "Payment",
        {
            paymentName: DataTypes.STRING,
            cardProvider: {
                type: DataTypes.ENUM("VISA", "MASTER"),
                allowNull: false,
            },
            cardNumber: {
                type: DataTypes.STRING(16),
                allowNull: false,
                validate: {
                    isNumeric: true,
                    isLengthThree(value) {
                        if (value.length !== 16) {
                            throw new CustomErr("cardNumber must have 16 character", 400);
                        }
                    },
                },
            },
            cardHolderName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            expiration: {
                type: DataTypes.STRING(7),
                allowNull: false,
                validate: {
                    isNumeric: true,
                    isLengthThree(value) {
                        if (value.length !== 6) {
                            throw new CustomErr("expiration must have 6 character", 400);
                        }
                    },
                },
            },
        },
        {
            tableName: "payments",
            underscored: true,
        }
    );

    Payment.associate = (models) => {
        // Payment.hasMany(models.Pledge, {
        //     foreignKey: {
        //         name: "paymentId",
        //         allowNull: false,
        //     },
        //     onUpdate: "RESTRICT",
        //     onDelete: "RESTRICT",
        // });

        Payment.belongsTo(models.User, {
            foreignKey: {
                name: "userId",
                allowNull: false,
            },
            onUpdate: "RESTRICT",
            onDelete: "RESTRICT",
        });
    };

    return Payment;
};