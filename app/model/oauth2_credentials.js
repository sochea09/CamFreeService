"use strict";

module.exports = Model;

function Model(db, DataTypes) {
    return db.define("oauth2_credentials", {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        client_id: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        client_secret: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        redirect_url: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        access_token: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        refresh_token: {
            type: DataTypes.STRING(255),
            allowNull: false
        }
    },{
        timestamps: false
    });
}
