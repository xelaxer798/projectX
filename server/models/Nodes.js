

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
        numberOfFlowSensors:{
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        numberOfOutlets:{
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        lastUpdate: {
            type: DataTypes.DATE,
            allowNull: true
        },
        flowSensorsQ: {
            type: DataTypes.STRING,
            allowNull: true,
            get() {
                return JSON.parse(this.getDataValue('flowSensorsQ'));
            },
            set(val) {
                return this.setDataValue('flowSensorsQ', JSON.stringify(val));
            },
        },
        flowSensorsPins: {
            type: DataTypes.STRING,
            allowNull: true,
            get() {
                return JSON.parse(this.getDataValue('flowSensorsPins'));
            },
            set(val) {
                return this.setDataValue('flowSensorsPins', JSON.stringify(val));
            },
        }
        


    });
    Nodes.associate = (models) => {
        Nodes.hasMany(models.Sensors, { foreignKey: 'nodeId' });
        Nodes.hasMany(models.Alerts,  { foreignKey: 'nodeId' });
        Nodes.belongsTo(models.Rooms, { foreignKey: 'roomId' , constraints: false});
    };

    return Nodes;

};