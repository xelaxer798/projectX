

module.exports = function (sequelize, DataTypes) {
    var Farms = sequelize.define("Farms", {
        farmId: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
        },
     
        farmName: {
            type: DataTypes.STRING,
            allowNull: true
        },
        


    });
    Farms.associate = (models) => {
        Farms.hasMany(models.Rooms, { foreignKey: 'roomId' });
        Farms.hasMany(models.Users, { foreignKey: 'farmId' });
    };

    return Farms;

};