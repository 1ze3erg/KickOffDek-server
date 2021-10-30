module.exports = (sequelize, DataTypes) => {
    const Reward = sequelize.define("Reward", {
        title: DataTypes.STRING,
        description: DataTypes.TEXT,
        image: DataTypes.STRING,
        minAmount: DataTypes.DECIMAL(10, 2),
        maxQtyPerPledge: DataTypes.INTEGER,
        limit: {
            type: DataTypes.INTEGER,
            validate: {
                min: 0
            }
        },
        remaining: {
            type: DataTypes.INTEGER,
            validate: {
                min: 0
            }
        },
        backerCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            validate: {
                min: 0
            }
        },
        estDeliveryMonth: {
            type: DataTypes.STRING(3),
            validate: {
                isLength(value) {
                    if (value.length !== 3) {
                        throw new CustomErr("estDeliveryMonth must have 3 character", 400);
                    }
                },
            }
        },
        estDeliveryYear: {
            type: DataTypes.STRING(4),
            validate: {
                isLength(value) {
                    if (value.length !== 4) {
                        throw new CustomErr("estDeliveryYear must have 4 character", 400);
                    }
                },
            }
        }
    }, {
        tableName: "rewards",
        underscored: true
    })

    Reward.associate = (models) => {
        Reward.belongsTo(models.Project, {
            foreignKey: {
                name: "projectId",
                allowNull: false,
            },
            onUpdate: "RESTRICT",
            onDelete: "RESTRICT",
        })

        Reward.hasMany(models.Pledge, {
            foreignKey: {
                name: "rewardId",
                allowNull: false,
            },
            onFaq: "RESTRICT",
            onDelete: "RESTRICT",
        });

        Reward.hasMany(models.Shipping, {
            foreignKey: {
                name: "rewardId",
                allowNull: false,
            },
            onFaq: "RESTRICT",
            onDelete: "RESTRICT",
        });
    }

    return Reward;
}