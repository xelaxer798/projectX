module.exports = function (sequelize, DataTypes) {
    var SensorErrors = sequelize.define("SensorErrors", {
        sensorErrorId: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
        },

        dataValueFloat: {
            type: DataTypes.DOUBLE,
            allowNull: true
        },
        errorString: {
            type: DataTypes.STRING,
            allowNull: true
        },

    }, {
        indexes: [
            {
                fields: ['createdAt']
            },
            {
                fields: ['sensorId']
            }

        ]

    });
    SensorErrors.associate = (models) => {

        SensorErrors.belongsTo(models.Sensors, {foreignKey: 'sensorId', constraints: false});
    };

    return SensorErrors;

};