module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define(
        "Comment",
        {
            message: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            tableName: "comments",
            underscored: true,
        }
    );

    Comment.associate = (models) => {
        Comment.belongsTo(models.User, {
            foreignKey: {
                name: "userId",
                allowNull: false,
            },
            onUpdate: "RESTRICT",
            onDelete: "RESTRICT",
        });

        Comment.belongsTo(models.Project, {
            foreignKey: {
                name: "projectId",
                allowNull: false,
            },
            onUpdate: "RESTRICT",
            onDelete: "RESTRICT",
        });
    };

    return Comment;
};
