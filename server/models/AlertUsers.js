


module.exports = function (sequelize, DataTypes) {
    var AlertUsers = sequelize.define("AlertUsers", {
        alertUserId: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
        },
     
        notificationMethod: {
            type: DataTypes.STRING,
            allowNull: true
        },
        notificationInterval: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        lastNotification: {
            type: DataTypes.DATE,
            allowNull:true
        }
        

    });

    AlertUsers.association = (models) => {
        AlertUsers.hasOne(models.Users);
        AlertUsers.hasOne(models.Alerts);
    };

    return AlertUsers;

};