/**
 * Created by bruce on 21-Dec-15.
 */

"use strict";

let models = camfree.model;
let assert = require("assert");
let v = require("validator");
let Register = module.exports = {};

Register.validateRegisterUser = function (body) {
    assert(body.email, "missing email field.");
    assert(body.password, "missing password field.");
    assert(body.firstname, "missing firstname field");
    assert(body.lastname, "missing lastname field");
    assert(body.gender, "missing gender field");
    assert(body.birthdate, "missing birthdate field");

    return true;
};
