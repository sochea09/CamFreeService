/**
 * Created by tsc on 2/15/16.
 */
"use strict";
let models = camfree.model;
let v = require("validator");
let _ = require("underscore");
let Validation = module.exports = {};
let errMsg;

Validation.validate = function (data, rules) {

    let valid = true;
    if(rules){
        for(let i = 0; i < rules.length; i++){
            _.map(rules[i], (rule, fieldname) => {
                let callbacks = rule.split('|');
                _.map(callbacks, (callback) => {
                    let fname = callback;
                    let value = (data[fieldname]) ? data[fieldname] : '';

                    if(callback.indexOf('between:') > -1){
                        let str = callback.split(':');
                        fname = 'between';
                        value = str[1]+':'+value.length;
                    }
                    else if(callback.indexOf('max:') > -1){
                        let str = callback.split(':');
                        fname = 'max';
                        value = str[1]+':'+value.length;
                    }
                    else if(callback.indexOf('min:') > -1){
                        let str = callback.split(':');
                        fname = 'min';
                        value = str[1]+':'+value.length;
                    }else if(callback.indexOf('unique:') > -1){
                        let str = callback.split(':');
                        fname = 'unique';
                        value = str[1]+':'+value;
                    }

                    if(Validation[fname](value, fieldname) == false) valid = false;
                });
            });
            if(valid == false) break;
        }
    }

    return valid;
}

Validation.required = function(value, fieldname){
    let valid = !_.isEmpty(value);
    if(valid == false) errMsg = "The "+fieldname+" is required.";
    return valid;
}
Validation.min = function(value, fieldname){
    let valid = !_.isEmpty(value);
    let str = value.split(':');
    if(str[0] <= str[1] == false){
        errMsg = "The "+fieldname+" must be equal or greater than "+str[0]+".";
        valid = false;
    }
    return valid;
}
Validation.max = function(value, fieldname){
    let valid = !_.isEmpty(value);
    let str = value.split(':');
    if(str[0] < str[1] == true){
        errMsg = "The "+fieldname+" must be less than "+str[0]+".";
        valid = false;
    }
    return valid;
}
Validation.between = function(value, fieldname){
    let valid = !_.isEmpty(value);
    let str = value.split(':');
    let sp = str[0].split('-');
    if(sp[0] <= str[1] == false || sp[1] < str[1] == true){
        errMsg = "The "+fieldname+" must be equal or greater than "+sp[0]+" and less than "+sp[1]+".";
        valid = false;
    }
    return valid;
}

Validation.unique = function * (value, fieldname){
    console.log(yield value);return;
    let valid = !_.isEmpty(value);
    let str = value.split(':');
    let sp = str[0].split('-');
    let t = sp[0];
    let f = sp[1];
    if(t && f){
        let email_exist = yield models.user.find({
            where: {
                email: 'me.sochea@gmail.com'
            }
        });
        if(email_exist) {
            errMsg = "The "+fieldname+" already exist.";
            valid = false;
        }
    }

    return valid;
}

Validation.getErrorMessage = function(){
   return errMsg;
}
