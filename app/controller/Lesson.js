"use strict";

// Alias namespaces
let lesson = require("./Lesson/Lesson");

//Load Controller
let Controller = module.exports = {};

Controller.create   = lesson.create;
Controller.list     = lesson.list;