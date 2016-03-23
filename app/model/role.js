"use strict";

module.exports = Model;

function Model(db, DataTypes) {
    return db.define("role", {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        is_active: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: true
        }
    });
}
