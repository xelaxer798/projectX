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


    });
    Alerts.associate = (models) => {
        // Alerts.hasMany(models.AlertCriteria, { foreignKey: 'alertCriteriaId' });
        Alerts.belongsTo(models.Sensors);
        Alerts.belongsToMany(models.Users, { through: 'AlertUsers' });
    };
    return Alerts;
};