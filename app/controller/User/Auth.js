"use strict";

let models = camfree.model;
let utils = camfree.utils;
let debug = require("debug")("camfree:controller:user:auth");

let validation = require("../../utils/Validation.js");

let Auth = module.exports = {};

Auth.signin = function* () {
    try{
        let rules = [{
            password: 'required|min:6',
            email: 'required|isEmail'

        }];

        let validate = yield validation.validate(this.body, rules);
        var error = yield validation.getErrorMessage();
        if( validate == false){
            this.fail({error: error},error);
        }else {
            let user = yield models.user.find({
                where: {
                    $or: [{
                        email: this.body.email
                    }, {
                        username: this.body.email
                    }],
                    password: utils.hash(this.body.password)
                }
            });
            if (!user) return this.fail({error:'User not found.'}, "User not found.");
            user = user.toJSON();
            this.ok(user);
        }
    }catch(e){
        this.error(e);
    }
}