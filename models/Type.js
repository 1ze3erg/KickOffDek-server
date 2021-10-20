module.exports = (sequelize, DataTypes) => {
    const Type = sequelize.define("Type", {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
    }, {
        tableName: "types",
        underscored: true
    })

    Type.associate = (models) => {
        Type.hasMany(models.Project, {
            foreignKey: {
                name: "typeId",
                allowNull: false,
            },
            onUpdate: "RESTRICT",
            onDelete: "RESTRICT",
        })
    }

    return Type;
}