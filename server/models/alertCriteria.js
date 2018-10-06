


module.exports = function (sequelize, DataTypes) {
    var alertCriteria = sequelize.define("alertCriteria", {
        alertCriteriaId: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
        },
     
        valueInt: {
            type: DataTypes.BIGINT,
            allowNull: true
        },
        valueFloat: {
            type: DataTypes.DOUBLE,
            allowNull: true
        },
        RelationalOperator: {
            type: DataTypes.STRING,
            allowNull: true
        },
        BooleanOperator:{
            type:DataTypes.STRING,
            allowNull:true
        },
        Order:{
            type:DataTypes.INTEGER,
            allowNull:true
        }

    });
    alertCriteria.associate = (models) => {
        alertCriteria.hasOne(models.Sensors, { foreignKey: 'sensorId' });
        alertCriteria.hasOne(models.Alerts, { foreignKey: 'alertId' });
    };

    return alertCriteria;

};