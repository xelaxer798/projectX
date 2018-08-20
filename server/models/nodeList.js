module.exports = function(sequelize, DataTypes) {
  var nodeList = sequelize.define("nodeLists", {
      id: {
          primaryKey: true,
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
      },
      nodeListID: {
          type: DataTypes.STRING,
          allowNull: true
      },
      serialNumber: {
        type: DataTypes.STRING,
        allowNull: true
    },
      userID: {
          type: DataTypes.STRING,
      },
      roomID: {
        type: DataTypes.STRING,
    },
      
      
  });
  return nodeList;
};