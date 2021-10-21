module.exports = (sequelize, DataTypes) => {
    const Category = sequelize.define("Category", {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
    }, {
        tableName: "categories",
        underscored: true
    })

    Category.associate = (models) => {
        Category.hasMany(models.Project, {
            foreignKey: {
                name: "categoryId",
                allowNull: false,
            },
            onUpdate: "RESTRICT",
            onDelete: "RESTRICT",
        })
    }

    return Category;
}