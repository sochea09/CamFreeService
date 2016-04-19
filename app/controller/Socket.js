"use strict";

let domain = require('domain');
let co = require('co');
let debug = require("debug")("camfree:controller:socket");

let Socket = module.exports = {};

function domainRun(socket) {

    var d = domain.create();
    d.on('error', function(er) {
        debug('error', er.stack);
        try {
            var killtimer = setTimeout(function() {
                process.exit(1);
            }, 30000);
            killtimer.unref();
        } catch (er2) {
            debug('Error sending 500!', er2.stack);
        }
    });
    d.add(socket);

    // Now run the handler function in the domain.
    d.run(function() {
        let handler = new camfree.service.SocketHandler(socket);
        co.wrap(handler.run).call(handler);
    });
}

Socket.camfree = function() {
    domainRun(this);
};
