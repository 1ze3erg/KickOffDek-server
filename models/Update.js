module.exports = (sequelize, DataTypes) => {
    const Update = sequelize.define(
        "Update",
        {
            title: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            message: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
        },
        {
            tableName: "updates",
            underscored: true,
        }
    );

    Update.associate = (models) => {
        Update.belongsTo(models.Project, {
            foreignKey: {
                name: "projectId",
                allowNull: false,
            },
            onUpdate: "RESTRICT",
            onDelete: "RESTRICT",
        });
    };

    return Update;
};
