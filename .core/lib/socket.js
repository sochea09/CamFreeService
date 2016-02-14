"use strict";

// import namespaces
let utils = camfree.utils;
let controller = camfree.controller;
let co = require("co");
let debugSocket = require("debug")("camfree:service");

/*
 * Convert the provided route handler to handler as
 * @param {Function} fn
 */
function getHandler(fn) {
    if (utils.isGeneratorFunction(fn)) {
        return function() {
            co(fn).call(this);
        };
    } else {
        return fn;
    }
}

function solveController(routeItem) {
    let paths = routeItem.handler.split("@");
    if (paths.length < 2) {
        throw new Error("Invalid controller " + routeItem.handler);
    }
    let controllerName = paths["0"]; // first path is controller name
    let actionName = paths["1"]; // second path is action name
    return {
        controller: controller[controllerName],
        action: controller[controllerName][actionName]
    }; //return return solved controller
}

function controllerResolver(routeItem) {
    let handlerType = typeof routeItem.handler;
    switch (handlerType) {
        case "function":
            // solve as function handler
            return {
                controller: null,
                action: routeItem.handler
            };
        case "string":
            // solve as controller - action handler
            return solveController(routeItem, routeItem.handler);
        default:
            throw new Error("unknow route type");
    }
}


function socketStart() {
    let socketRouter = camfree.socket.route;
    let endPoints = utils._.groupBy(socketRouter, "namespace");
    let io = camfree.socket.io;

    utils._.each(endPoints, function(endPoint, key) {
        io.of(key)
            .on("connection", function(socket) {
                debugSocket("Client %s connected at %s", socket.id, key);
                endPoint.forEach(function(routeItem) {
                    let handler = controllerResolver(routeItem);
                    getHandler(handler.action).call(socket);
                });
            });
    });
}

module.exports = socketStart;
