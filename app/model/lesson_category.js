"use strict";

module.exports = Model;

function Model(db, DataTypes) {
    return db.define("lesson_category", {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        is_active: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        },
        order: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        },
        created_at: {
            type: DataTypes.DATE
        },
        updated_at: {
            type: DataTypes.DATE
        },
        created_by: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
        }, {
            timestamps: true,
            classMethods: {
                maxOrder: function * () {
                    let maxOrderNum =  yield db.models.lesson_category.max('order');
                    if(maxOrderNum)
                        return maxOrderNum + 1;
                    else return 1;
                }
            }
        });
}
