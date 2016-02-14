"use strict";

// import namespaces
let utils = camfree.utils;
let response = require("./response");


let resMethods = [
    "append", "attachment", "cookie", "clearCookie", "render", "send", "json", "jsonp", "location", "type",
    "end", "format", "redirect", "download", "sendfile", "status", "ok", "fail", "error", "sendStatus", "vary"
];

let resProperties = [
    "locals", "headersSent", "__"
];

let reqMethods = [
    "render", "session", "get", "accepts", "acceptsLanguages", "is", "acceptsCharsets", "acceptsEncodings"
];

let reqProperties = [
    "params", "body", "query", "cookies", "signedCookies", "path", "xhr"
];

module.exports = Context;

function Context(req, res) {
    response(req, res);
    this.req = req;
    this.res = res;
}

function bindMethods(methods, context) {
    utils.each(methods, function(method) {
        Context.prototype[method] = function() {
            return this[context][method].apply(this[context], utils.toArray(arguments));
        };
    });
}

function defineFields(properties, context) {
    properties.forEach(function(propName) {
        Object.defineProperty(Context.prototype, propName, {
            get: function() {
                return this[context][propName];
            },
            set: function(value) {
                this[context][propName] = value;
                return this[context][propName];
            }
        });
    });
}

bindMethods(reqMethods, "req");
bindMethods(resMethods, "res");

defineFields(reqProperties, "req");
defineFields(resProperties, "res");

Object.defineProperty(Context.prototype, "limit", {
    get: function limit() {
        if (this.query && this.query.limit) return (this.query.limit * 1);
        return 20;
    }
});

Object.defineProperty(Context.prototype, "offset", {
    get: function offset() {
        if (this.query && this.query.offset) return (this.query.offset * 1);
        return 0;
    }
});

Context.prototype.terminate = function(code, message) {
    return this.status(code).send(message || utils.getStatusMessage(code));
};
