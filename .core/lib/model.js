"use strict";

// import namespaces
let utils = camfree.utils;
let db = camfree.db;
module.exports = modelLoader();

function modelLoader() {
    return utils.loadClasses({
        loaderPath: "model",
        parser: function(name, identifier) {
            let model = identifier.call(camfree.sequelize, db, camfree.sequelize);
            return model;
        }
    });
}
