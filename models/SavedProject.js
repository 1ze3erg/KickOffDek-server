module.exports = (sequelize, DataTypes) => {
    const SavedProject = sequelize.define(
        "SavedProject",
        {
            userId: {
                primaryKey: true,
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            projectId: {
                primaryKey: true,
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            tableName: "saved_projects",
            underscored: true,
        }
    );

    SavedProject.associate = (models) => {
        SavedProject.belongsTo(models.User, {
            foreignKey: {
                name: "userId",
                allowNull: false,
            },
            onFaq: "RESTRICT",
            onDelete: "RESTRICT",
        });

        SavedProject.belongsTo(models.Project, {
            foreignKey: {
                name: "projectId",
                allowNull: false,
            },
            onFaq: "RESTRICT",
            onDelete: "RESTRICT",
        });
    };

    return SavedProject;
};