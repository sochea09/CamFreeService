"use strict";

// Alias namespaces
let models = camfree.model;
let assert = require("assert");
let v = require("validator");
let Mem = camfree.memStore.share;
let SocketRes = module.exports = {};
let root = {};
SocketRes.onTutorial = function *(data, auth_id) {
    root.res_type = "tutoria_upload_video";
    root.data = data;
    console.log(root);
    let user = yield models.user.findOne({
        where:{
            id:auth_id
        }
    });

    if(null != user) {
        Mem.publish("CHN:" + user.hash, JSON.stringify(root));
    }else{
        console.log("no auth");
    }
};
