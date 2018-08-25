

module.exports = function (sequelize, DataTypes) {
    var rooms = sequelize.define("rooms", {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
        },
        roomSize: {
            type: DataTypes.STRING,
            allowNull: false
        },
        roomName: {
            type: DataTypes.STRING,
            allowNull: true
        },
        nodeList: {

            type: DataTypes.STRING,
        },


    });
    rooms.associate = (models) => {

        rooms.belongsTo(models.users, { foreignKey: 'userId' });
    };

    return rooms;

};