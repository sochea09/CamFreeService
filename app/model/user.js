"use strict";

module.exports = Model;

function Model(db, DataTypes) {
    return db.define("user", {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        uid: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        hash: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        country_code: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        phone_number: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        has_password: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false,
        },
        access_key: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        last_login: {
            type: DataTypes.DATE,
            allowNull: false
        },
        is_pw_change: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        role_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
            references: {
                model: "role",
                key: "id"
            }
        },
        status: {
            type: DataTypes.ENUM,
            defaultValue: "pending",
            values: ["active", "pending", "deleted", "banned", "inactive", "deactive"]
        },
        is_email_verified: {
            type: DataTypes.BOOLEAN
        },
        is_phone_verified: {
            type: DataTypes.BOOLEAN
        },
        created_at: {
            type: DataTypes.DATE
        },
        updated_at: {
            type: DataTypes.DATE
        }
    }, {
        timestamps: true,
        classMethods: {
            findByAccessKey: function * (access_key) {
                return yield db.models.user.findOne({
                    where: {
                        access_key: access_key
                    }
                });
            },
            newUid: function * (email) {
                let username = email.split("@")[0];
                let exist = yield db.models.user.count({
                    where: ["uid LIKE ?", username + "%"]
                });
                if (!exist) return username;
                return username + (exist + 1);
            }
        }
    });
}
