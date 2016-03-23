/**
 * Created by bruce on 15-Feb-16.
 */

"use strict";

let Upload = require("./Upload/Upload")
 ,  Controller = module.exports = {};

Controller.run = Upload.run;
Controller.resumableUpload = Upload.resumableUpload;
Controller.getAuthorizationCode = Upload.getAuthorizationCode;
Controller.getToken = Upload.getToken;
