"use strict";
let debug = require("debug")("camfree:before");
let co = require("co");

function model() {

}

function app() {
    let device = require("express-device");
    let bodyParser = require("body-parser");
    let multer = require("multer");
    camfree.components.app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    camfree.components.app.use(device.capture());
    camfree.components.app.use(multer().single("media"));
    camfree.components.app.use(bodyParser.json());

}

function database() {

}

function socket() {

    debug("socket start");
    console.log("socket start");
    camfree.socket.io.use(co.wrap(function * (socket, next) {
        console.log('===============================');
        let query = socket.handshake.query;
        let token = query.token;
        let device = query.device;
        debug("socket.query", query);
        let authToken = yield savada.model.user.findAll({
            where:{
                hash: token
            }
        });
        if (!authToken.length) {
            next(new Error("Fail authenticate"));
        } else {
            socket.request.auth = authToken[0].toJSON();
            next();
        }
    }));

}

function controller() {

}

function filter() {

}

function route() {

}

function service() {

}


module.exports = {
    model: model,
    app: app,
    database: database,
    service: service,
    socket: socket,
    controller: controller,
    filter: filter,
    route: route
};
