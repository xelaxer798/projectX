

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



    });
    Sensors.associate = (models) => {
        Sensors.hasMany(models.sensorData, { foreignKey: 'sensorDataId' });
        Sensors.belongsTo(models.Nodes, { foreignKey: 'nodeId' });
        Sensors.hasMany(models.alertCriteria, { foreignKey: 'alerCriteriaId' });
    };

    return Sensors;

};