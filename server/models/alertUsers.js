


module.exports = function (sequelize, DataTypes) {
    var alertUsers = sequelize.define("alertUsers", {
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
    return alertUsers;

};