module.exports = function (sequelize, DataTypes) {
    var WebCamImages = sequelize.define("WebCamImages", {
        webCamImagesId: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
        },
        webCamId: {
            type: DataTypes.STRING,
            allowNull: false
        },
        imageType: {
            type: DataTypes.STRING,
            allowNull: false
        },
        image: {
            type: DataTypes.BLOB('long')
        },
        imageSize: {
            type: DataTypes.INTEGER
        },
        imageName: {
            type: DataTypes.STRING
        }
    });

    return WebCamImages;
};