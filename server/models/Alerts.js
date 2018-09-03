module.exports = function(sequelize, DataTypes) {
    var warnings = sequelize.define("warnings", {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
        },
        userId: {
            type: DataTypes.STRING,
            allowNull: false
        },
        
        nodeId: {
            type: DataTypes.STRING,
        },
        warning: {
            type: DataTypes.STRING,
        },
        time: {
            type: DataTypes.STRING,
        }
    });
    return warnings;
  };