

module.exports = function (sequelize, DataTypes) {
    var Rooms = sequelize.define("Rooms", {
        roomId: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
        },
     
        roomName: {
            type: DataTypes.STRING,
            allowNull: true
        },
        


    });
    Rooms.associate = (models) => {
        Rooms.hasMany(models.Nodes, { foreignKey: 'nodeId' });
        Rooms.belongsTo(models.Farms, { foreignKey: 'farmId' });
    };

    return Rooms;

};