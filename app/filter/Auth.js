"use strict";

// Alias namespaces
let models = camfree.model;
let utils = camfree.utils;

let assert = require("assert");
let debug = require("debug")("camfree:filter:auth");
let request = require("co-request");
let social = utils.getConfig("social");

let Auth = module.exports = {};

/**
 * Respond with 401 "Unauthorized".
 *
 * @param {ServerResponse} res
 * @param {String} realm
 * @api private
 */
function unauthorized(ctx) {
    ctx.status(401);
    ctx.res.append("WWW-Authenticate", "Basic realm=\"Authorization Required\"");
    let message = ctx.__("Authorization Required");
    ctx.fail(message, message);
}

/**
 * Check if username and password are correct
 * @param {String} username
 * @param {String} password
 * @api private
 */
function * checkCredential(ctx, username, password) {
    let user = yield models.user.find({
        where: {
            username: username,
            password: password
        }
    });
    return user;
}

/**
 * Check if provided authorization header is valid format
 * @api private
 */
function validateAuthenticate(ctx) {
    let authorization = ctx.get("AUTHORIZATION");
    if (!authorization) {
        return false;
    }
    let parts = authorization.split(" ");
    assert(parts.length === 2);
    return parts;
}

function * sessionAuth(ctx) {
    let accessKey = ctx.get("X-AUTH");
    let user = yield models.user.findByAccessKey(accessKey);
    return user;
}

function * basicAuth(ctx) {
    let parts = validateAuthenticate(ctx);
    if (!parts) return false;
    let scheme = parts[0];
    let buffer = new Buffer(parts[1], "base64");
    let credentials = buffer.toString();
    let index = credentials.indexOf(":");

    assert(scheme === "Basic");
    assert(index < 0);

    let username = credentials.slice(0, index);
    let password = credentials.slice(index + 1);
    return yield checkCredential(ctx, username, password);
}

/**
 * Check if the request from client is authenticated
 * @api public
 */
Auth.validate = function * () {
    try {
        // check if user already authenticated
        debug("user access key auth", this.get("X-AUTH"));
        let user = yield sessionAuth(this);
        if (!user) {
            debug("user basic auth", this.get("X-AUTH"));
            user = yield basicAuth(this);
        }
        if (!user) {
            return unauthorized(this);
        }
        debug("Auth success", user.toJSON());
        this.auth = user;
    } catch (err) {
        debug("authentication failed");
        this.error(err);
    }
};
/**
 * Check if the request from client is authenticated
 * @api public
 */
Auth.optValidate = function * () {
    try {
        // check if user already authenticated
        debug("user access key auth", this.get("X-AUTH"));
        let user = yield sessionAuth(this);
        if (!user) {
            debug("user basic auth", this.get("X-AUTH"));
            user = yield basicAuth(this);
        }
        debug("Auth success", user ? user.toJSON() : "FAILED");
        this.auth = user;
    } catch (err) {
        debug("authentication failed");
        this.error(err);
    }
};


Auth.checkFacebookAuth = function * () {
    try {
        debug("Auth facebook filter");
        let result = yield request.get(social.facebook.url + this.body.facebook_id, {
            qs: {
                access_key: this.body.facebook_token,
                fields: "id,name,first_name,last_name,birthday,gender"
            }
        });
        if (!result || result.error) {
            return this.fail({
                token_expired: true
            }, this.__("Facebook token expired"));
        }
        result.token = this.body.facebook_token;
        this.facebook = result;
    } catch (err) {
        debug("Facebook auth filter failed");
        this.error(err);
    }
};

Auth.checkTwitterAuth = function * () {
    try {
        debug("Auth twitter filter");
        let result = yield request.get(social.twitter.url + "/users/show.json?screen_name=" + this.body.screen_name, {
            headers: {
            }
        });
        if (!result || result.error) {
            return this.fail({
                token_expired: true
            }, this.__("Facebook token expired"));
        }
        result.token = this.body.facebook_token;
        this.facebook = result;
    } catch (err) {
        debug("Facebook auth filter failed");
        this.error(err);
    }
};