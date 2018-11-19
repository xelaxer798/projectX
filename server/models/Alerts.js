module.exports = function (sequelize, DataTypes) {
    var Alerts = sequelize.define("Alerts", {
        alertId: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
        },
        alertName: {
            type: DataTypes.STRING,
            allowNull: false
        },

        highValue: {
            type: DataTypes.DOUBLE,
            allowNull: true
        },
        lowValue: {
            type: DataTypes.DOUBLE,
            allowNull: true
        },
        status: {
            type: DataTypes.STRING,
            allowNull: true
        },
        active: {
            type: DataTypes.BOOLEAN
        }

    });
    Alerts.associate = (models) => {
        Alerts.belongsTo(models.Sensors, { foreignKey: 'sensorId' });
        Alerts.belongsToMany(models.Users, { through: 'AlertUsers' });
    };
    return Alerts;
};