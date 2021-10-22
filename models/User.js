module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
        "User",
        {
            avatar: DataTypes.STRING,
            username: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: true,
                },
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            firstName: DataTypes.STRING,
            lastName: DataTypes.STRING,
            phoneNumber: DataTypes.STRING,
            facebook: DataTypes.STRING,
            instagram: DataTypes.STRING,
            twitter: DataTypes.STRING,
            website: DataTypes.STRING,
            province: DataTypes.STRING,
            country: DataTypes.STRING,
            loginWith: {
                type: DataTypes.ENUM("email", "google"),
                allowNull: false,
            },
        },
        {
            tableName: "users",
            underscored: true,
        }
    );

    User.associate = (models) => {
        User.hasMany(models.ShippingAddress, {
            foreignKey: {
                name: "userId",
                allowNull: false,
            },
            onUpdate: "RESTRICT",
            onDelete: "RESTRICT",
        });

        User.hasMany(models.Payment, {
            foreignKey: {
                name: "userId",
                allowNull: false,
            },
            onUpdate: "RESTRICT",
            onDelete: "RESTRICT",
        });

        User.hasMany(models.Project, {
            foreignKey: {
                name: "creatorUserId",
                allowNull: false,
            },
            onUpdate: "RESTRICT",
            onDelete: "RESTRICT",
        });

        User.hasMany(models.Pledge, {
            foreignKey: {
                name: "userId",
                allowNull: false,
            },
            onUpdate: "RESTRICT",
            onDelete: "RESTRICT",
        });

        User.hasMany(models.SavedProject, {
            foreignKey: {
                name: "userId",
                allowNull: false,
            },
            onFaq: "RESTRICT",
            onDelete: "RESTRICT",
        });
    };

    return User;
};
