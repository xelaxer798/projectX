

module.exports = function (sequelize, DataTypes) {
    var SensorData = sequelize.define("SensorData", {
        sensorDataId: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
        },
     
        dataValueInt: {
            type: DataTypes.BIGINT,
            allowNull: true
        },
        dataValueFloat: {
            type: DataTypes.DOUBLE,
            allowNull: true
        },
        dataValueString: {
            type: DataTypes.STRING,
            allowNull: true
        },
        


    });
    SensorData.associate = (models) => {

        SensorData.belongsTo(models.Sensors, { foreignKey: 'sensorId' });
    };

    return SensorData;

};