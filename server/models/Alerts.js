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
        currentValue: {
            type: DataTypes.DOUBLE,
            allowNull: true
        },
        alertType: {
            type: DataTypes.STRING
        },
        nodeNonReportingTimeLimit: {
            type: DataTypes.INTEGER
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
        Alerts.belongsTo(models.Nodes, {foreignKey: 'nodeId'});
        Alerts.belongsTo(models.Sensors, { foreignKey: 'sensorId' });
        Alerts.belongsToMany(models.Users, { through: 'AlertUsers' });
    };
    return Alerts;
};