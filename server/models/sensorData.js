

module.exports = function (sequelize, DataTypes) {
    var sensorData = sequelize.define("sensorData", {
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
    sensorData.associate = (models) => {

        sensorData.belongsTo(models.Sensors, { foreignKey: 'sensorId' });
    };

    return sensorData;

};