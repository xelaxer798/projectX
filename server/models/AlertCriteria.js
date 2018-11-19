


module.exports = function (sequelize, DataTypes) {
    var AlertCriteria = sequelize.define("AlertCriteria", {
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
    AlertCriteria.associate = (models) => {
        // AlertCriteria.belongsTo(models.Sensors, { foreignKey: 'sensorId' });
        // AlertCriteria.belongsTo(models.Alerts, { foreignKey: 'alertId' });
    };

    return AlertCriteria;

};