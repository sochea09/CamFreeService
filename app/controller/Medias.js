"use strict";

// Alias namespaces
let Medias = require("./Media/Media.js");

//Load Controller
let Controller = module.exports = {};

//Load event list from event controller
Controller.upload = Medias.upload;
Controller.uploadimage = Medias.uploadimage;
Controller.uploadfile = Medias.uploadfile;
Controller.uploadvideo = Medias.uploadvideo;
Controller.uploadImageThumbnail = Medias.uploadImageThumbnail;
Controller.uploadImageCover = Medias.uploadImageCover;
