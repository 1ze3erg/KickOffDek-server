module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("User", {
        avatar: DataTypes.STRING,
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        firstName: DataTypes.STRING,
        lastName: DataTypes.STRING,
        phoneNumber: DataTypes.STRING,
        facebook: DataTypes.STRING,
        instagram: DataTypes.STRING,
        twitter: DataTypes.STRING,
        website: DataTypes.STRING,
        province: DataTypes.STRING,
        country:  DataTypes.STRING,
        loginWith: {
            type: DataTypes.ENUM("email", "google"),
            allowNull: false
        }
    }, {
        tableName: "users",
        underscored: true
    })

    return User;
}