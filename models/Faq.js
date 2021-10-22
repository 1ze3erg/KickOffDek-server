module.exports = (sequelize, DataTypes) => {
    const Faq = sequelize.define(
        "Faq",
        {
            question: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            anwser: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            tableName: "faqs",
            underscored: true,
        }
    );

    Faq.associate = (models) => {
        Faq.belongsTo(models.Project, {
            foreignKey: {
                name: "projectId",
                allowNull: false,
            },
            onFaq: "RESTRICT",
            onDelete: "RESTRICT",
        });
    };

    return Faq;
};