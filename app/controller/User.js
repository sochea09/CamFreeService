"use strict";

// Alias namespaces
let Register = require("./User/Register");
let User = module.exports = {};

// Auth
User.create = Register.create;
