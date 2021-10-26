module.exports = (sequelize, DataTypes) => {
    const Reward = sequelize.define("Reward", {
        title: DataTypes.STRING,
        description: DataTypes.TEXT,
        image: DataTypes.STRING,
        minPledge: DataTypes.DECIMAL(10, 2),
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
        estDeliveryMonth: DataTypes.STRING,
        estDeliveryYear: DataTypes.STRING,
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