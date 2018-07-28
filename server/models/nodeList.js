module.exports = function(sequelize, DataTypes) {
  var nodeList = sequelize.define("rooms", {
      id: {
          primaryKey: true,
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
      },
      nodeListID: {
          type: DataTypes.STRING,
          allowNull: false
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