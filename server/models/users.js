module.exports = function(sequelize, DataTypes) {
    var users = sequelize.define("users", {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
        },
        firstName: {
            type: DataTypes.STRING,
        },
        lastName: {
            type: DataTypes.STRING,
        },
        address: {
            type: DataTypes.STRING,
        },
        phone: {
            type: DataTypes.STRING,
        },
        subscription: {
                    type: DataTypes.STRING,
            defaultValue: "basic"
        },
        verified  : {
            type: DataTypes.STRING,
            defaultValue: false
        },
        inactive: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
          }
    });
    return users;
  };