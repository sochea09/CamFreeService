"use strict";
let fs = require("fs");

module.exports = {
    key: fs.readFileSync(camfree.app.path + "/storage/cert/server.key"),
    cert: fs.readFileSync(camfree.app.path + "/storage/cert/server.crt")
};
