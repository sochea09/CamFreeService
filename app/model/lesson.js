"use strict";

module.exports = Model;

function Model(db, DataTypes) {
    return db.define("lesson", {
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
        begin_file_name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        finish_file_name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        order: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        },
        status: {
            type: DataTypes.ENUM,
            defaultValue: "pending",
            values: ["active", "pending", "deleted", "banned", "inactive", "deactive"]
        },
        vdo_id: {
            type: DataTypes.STRING,
            allowNull: true
        },
        lesson_category_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
            references: {
                model: "lesson_category",
                key: "id"
            }
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
                    let maxOrderNum =  yield db.models.lesson.max('order');
                    if(maxOrderNum)
                        return maxOrderNum + 1;
                    else return 1;
                }
            }
        });
}
