"use strict";

let models = camfree.model;
//Validator
let Validator = require('great-validator');
Validator.setModels(models);

let Register = module.exports = {};

Register.validateRegisterUser = function (body) {
    //let msg;
    var rules = {
        email:    'required|email|unique:user,email',
        password: 'required|min:8'
    }

    var data = {
        email:    body.email,
        password: body.password
    }

    let validator = new Validator(rules, data);
    console.log(validator.passes());
    if(validator.passes() == false){
        let email = validator.errors().email;
        let password = validator.errors().password;
        let msg;
        if(email && email[0].indexOf("Required") > -1){
            msg = "Email field is required.";
        } else if(email && email[0].indexOf("Email") > -1){
            msg = "Invalid email address.";
        } else if(email && email[0].indexOf("Unique") > -1){
            msg = "Email is used.";
        } else if(password && password[0].indexOf("Required") > -1){
            msg = "Password field is required.";
        } else if(password && password[0].indexOf("Min") > -1){
            msg = "Password field must be equal or more than 8 characters.";
        }
        console.log(msg);
    }
    //return msg;
    //validator.check()
    //    .then(function(isValid) {
    //        if (isValid) {
    //            return true;
    //        }
    //        else {
    //            let email = validator.errors().email;
    //            let password = validator.errors().password;
    //            //let msg;
    //            if(email && email[0].indexOf("Required") > -1){
    //                msg = "Email field is required.";
    //            } else if(email && email[0].indexOf("Email") > -1){
    //                msg = "Invalid email address.";
    //            } else if(email && email[0].indexOf("Unique") > -1){
    //                msg = "Email is used.";
    //            } else if(password && password[0].indexOf("Required") > -1){
    //                msg = "Password field is required.";
    //            } else if(password && password[0].indexOf("Min") > -1){
    //                msg = "Password field must be equal or more than 8 characters.";
    //            }
    //            //return msg;
    //        }
    //    })
    //    .catch(function(err) {
    //        console.error(err);
    //    });
    //return msg;
};
