

module.exports = function (sequelize, DataTypes) {
    var Sensors = sequelize.define("Sensors", {
        sensorId: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
        },

        sensorName: {
            type: DataTypes.STRING,
            allowNull: true
        },
        units: {
            type: DataTypes.STRING,
            allowNull: true
        },
        currentValue: {
            type: DataTypes.DOUBLE,
            allowNull: true
        },



    });
    Sensors.associate = (models) => {
        Sensors.hasMany(models.SensorData, { foreignKey: 'sensorId' , constraints: false});
        Sensors.belongsTo(models.Nodes, { foreignKey: 'nodeId' });
        // Sensors.hasMany(models.AlertCriteria, { foreignKey: 'alertCriteriaId' });
        Sensors.hasMany(models.Alerts, { foreignKey: 'sensorId' });
    };

    return Sensors;

};