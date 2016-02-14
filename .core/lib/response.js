"use strict";
let debug = require("debug")("camfree:core:response");

let response = {

    ok: function(req, res, content, message) {
        if (!res.headerSent) {
            res.append("X-MESSAGE", message || "success");
            res.status(200).json(content);
        }
    },
    fail: function(req, res, content, message) {
        if (!res.headerSent) {
            res.append("X-MESSAGE", message || "bad request");
            res.status(400).json(content);
        }
    },
    error: function(req, res, err, message) {
        let code = 500;
        debug("ERROR: ", err ? err.stack : err);
        if (err && (err.constructor.name === "AssertionError")) code = 400;
        res.append("X-MESSAGE", message || err.message);

        if (!res.headerSent) {
            let output = camfree.app.environment === "production" ? err.message : err.stack;
            if (req.get("X-APP") !== "mobile") {
                res.status(code).json(output.replace(/(?:\r\n|\r|\n)/g, "<br />"));
            } else {
                res.status(code).json(output);
            }
        }
    }
};

module.exports = function(req, res) {
    res.ok = function(content, message) {
        return response.ok(req, res, content, message);
    };
    res.fail = function(content, message) {
        return response.fail(req, res, content, message);
    };
    res.error = function(content, message) {
        return response.error(req, res, content, message);
    };
};
