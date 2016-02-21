"use strict";

let models = camfree.model;
let utils = camfree.utils;
let debug = require("debug")("camfree:controller:user:register");
let validation = require("../../utils/Validation.js");

let Register = module.exports = {};

Register.randomCode = function* () {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i <25; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
};
Register.create = function * () {
    try{
        let rules = [{
                password: 'required|min:6',
                email: 'required|isEmail|unique:user-email'

            }];

        let validate = yield validation.validate(this.body, rules);
        var error = yield validation.getErrorMessage();
        if( validate == false){
            this.fail(error);
        }else {
            let email_confirm_code = yield Register.randomCode();
            let uid = yield models.user.newUid(this.body.username || this.body.email);
            let user = yield models.user.create({
                username: this.body.username || uid,
                email: this.body.email,
                country_code: this.body.country_code,
                phone_number: this.body.phone_number,
                password: utils.hash(this.body.password),
                uid: uid,
                email_confirm_code: email_confirm_code,
                access_key: utils.hash((utils.uuidV1())),
                last_login: new Date(),
                is_pw_change: false,
                role_id: 5,
                hash: utils.uuidV1()
            });

            user = user.toJSON();
            this.ok(user,"Thanks for signing up. Please check your email for confirmation!");
        }
    }catch (err) {
        this.error(err);
    }
};
