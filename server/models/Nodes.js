

module.exports = function (sequelize, DataTypes) {
    var Nodes = sequelize.define("Nodes", {
        nodeId: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
        },
     
        nodeName: {
            type: DataTypes.STRING,
            allowNull: true
        },
        


    });
    Nodes.associate = (models) => {
        Nodes.hasMany(models.Sensors, { foreignKey: 'nodeId' });
        Nodes.belongsTo(models.Rooms, { foreignKey: 'roomId' , constraints: false});
    };

    return Nodes;

};