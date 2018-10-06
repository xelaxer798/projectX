


module.exports = function (sequelize, DataTypes) {
    var AlertUsers = sequelize.define("AlertUsers", {
        alertUserId: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
        },
     
        NotificationMethod: {
            type: DataTypes.STRING,
            allowNull: true
        },
        NotificationInterval: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        

    });
    return AlertUsers;

};