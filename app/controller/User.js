"use strict";

// Alias namespaces
let Register = require("./User/Register");
let Auth = require("./User/Auth");
let User = module.exports = {};

// Auth
User.create = Register.create;
User.signin = Auth.signin;
