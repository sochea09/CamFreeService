"use strict";

// import namespaces
let utils = camfree.utils;
let app = camfree.app;
let Sequelize = camfree.sequelize;

global.Sequelize = require("sequelize");
let databaseConfig = utils.getConfig("database");
let dbLog = require("debug")("savada:db");

if (app.config.debug && databaseConfig.logging) {
    databaseConfig.logging = dbLog;
}

let db = new Sequelize(
    databaseConfig.database,
    databaseConfig.username,
    databaseConfig.password,
    databaseConfig
);

module.exports = db;
