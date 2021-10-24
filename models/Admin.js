module.exports = (sequelize, DataTypes) => {
    const Admin = sequelize.define(
        "Admin",
        {
            username: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            password: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            tableName: "admins",
            underscored: true,
        }
    );

    return Admin;
};