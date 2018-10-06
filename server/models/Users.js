module.exports = function (sequelize, DataTypes) {
    var Users = sequelize.define("Users", {
        userId: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
        },
        firstName: {
            type: DataTypes.STRING,
        },
        lastName: {
            type: DataTypes.STRING,
        },
        address: {
            type: DataTypes.STRING,
        },
        phone: {
            type: DataTypes.STRING,
        },
        subscription: {
            type: DataTypes.STRING,
            defaultValue: "basic"
        },
        verified: {
            type: DataTypes.STRING,
            defaultValue: false
        },
        inactive: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
    });
    Users.associate =  (models)=> {
       
        Users.belongsTo(models.Farms , { foreignKey: 'farmId' });
        Users.belongsToMany(models.Alerts, { through:'AlertUsers' });
        };
return Users;
  };
//   users.belongsTo(models.Farms, { foreignKey: 'farmId' });