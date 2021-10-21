const CustomErr = require("../helpers/err");

module.exports = (sequelize, DataTypes) => {
    const Project = sequelize.define(
        "Project",
        {
            title: DataTypes.STRING,
            about: DataTypes.STRING,
            status: {
                type: DataTypes.ENUM("draft", "review", "live", "successful", "failed", "canceled"),
                allowNull: false,
            },
            target: DataTypes.DECIMAL(10, 2),
            startDate: DataTypes.DATE,
            endDate: DataTypes.DATE,
            organization: DataTypes.STRING,
            tagline: DataTypes.STRING,
            province: DataTypes.STRING,
            country: DataTypes.STRING,
            facebook: DataTypes.STRING,
            instagram: DataTypes.STRING,
            twitter: DataTypes.STRING,
            website: DataTypes.STRING,
            coverImage: DataTypes.STRING,
            campaignImage: DataTypes.STRING,
            pitchVideo: DataTypes.STRING,
            campaignStory: DataTypes.TEXT,
            budgetOverview: DataTypes.TEXT,
            risk: DataTypes.TEXT
        },
        {
            tableName: "projects",
            underscored: true,
        }
    );

    Project.associate = (models) => {
        Project.belongsTo(models.User, {
            foreignKey: {
                name: "creatorUserId",
                allowNull: false,
            },
            onUpdate: "RESTRICT",
            onDelete: "RESTRICT",
        });

        Project.belongsTo(models.Category, {
            foreignKey: {
                name: "categoryId",
                allowNull: false,
            },
            onUpdate: "RESTRICT",
            onDelete: "RESTRICT",
        });

        Project.belongsTo(models.Type, {
            foreignKey: {
                name: "typeId",
                allowNull: false,
            },
            onUpdate: "RESTRICT",
            onDelete: "RESTRICT",
        });

        Project.belongsTo(models.Currency, {
            foreignKey: {
                name: "currencyId",
                allowNull: false,
            },
            onUpdate: "RESTRICT",
            onDelete: "RESTRICT",
        });
    };

    return Project;
};
