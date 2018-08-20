module.exports = function (sequelize, DataTypes) {
  var nodes = sequelize.define("nodes", {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    nodeId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    nodeName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    roomId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    roomName: {
      type: DataTypes.STRING,
      allowNull: true
    },

    nodeType: {
      type: DataTypes.STRING,
      allowNull: true
    },
    temperature: {
      type: DataTypes.STRING,
      allowNull: true
    },
    humidity: {
      type: DataTypes.STRING,
      allowNull: true
    },
    r: {
      type: DataTypes.STRING,
      allowNull: true
    },
    g: {
      type: DataTypes.STRING,
      allowNull: true
    },
    b: {
      type: DataTypes.STRING,
      allowNull: true
    },
    lux: {
      type: DataTypes.STRING,
      allowNull: true
    },
    full: {
      type: DataTypes.STRING,
      allowNull: true
    },
    visible: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ir: {
      type: DataTypes.STRING,
      allowNull: true
    },

    currentTime: {
      type: DataTypes.STRING
    },
    date: {
      type: DataTypes.DATEONLY,
    },


  });
  return nodes;
};
