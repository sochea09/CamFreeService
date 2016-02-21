/**
 * Created by tsc on 2/15/16.
 */
"use strict";

let models = camfree.model;
let v = require("validator");
let _ = require("underscore");
let Validation = module.exports = {};
let errMsg;

Validation.validate = function * (data, rules) {
    let valid = true;
    if(rules){
        for(let i = 0; i < rules.length; i++){
            for(let j in rules[i]){
                let callbacks = rules[i][j].split('|');
                callbacks.reverse();
                for(let k in callbacks){
                    let fname = callbacks[k];
                    let value = (data[j]) ? data[j] : '';

                    if(fname.indexOf('between:') > -1){
                        let str = fname.split(':');
                        fname = 'between';
                        value = str[1]+':'+value.length;
                    }
                    else if(fname.indexOf('max:') > -1){
                        let str = fname.split(':');
                        fname = 'max';
                        value = str[1]+':'+value.length;
                    }
                    else if(fname.indexOf('min:') > -1){
                        let str = fname.split(':');
                        fname = 'min';
                        value = str[1]+':'+value.length;
                    }else if(fname.indexOf('unique:') > -1){
                        let str = fname.split(':');
                        fname = 'unique';
                        value = str[1]+':'+value;
                    }
                    let vali = yield  this[fname](value, j);
                    if(vali == false) valid = false;
                }
            }
        }

    }

    return valid;
}

Validation.required = function * (value, fieldname){
    let valid = !_.isEmpty(value);
    if(valid == false) errMsg = "The "+fieldname+" is required.";
    return valid;
}
Validation.min = function * (value, fieldname){
    let valid = !_.isEmpty(value);
    let str = value.split(':');
    if(parseInt(str[0]) > parseInt(str[1]) == true){
        errMsg = "The "+fieldname+" must be equal or greater than "+str[0]+".";
        valid = false;
    }
    return valid
}
Validation.max = function * (value, fieldname){
    let valid = !_.isEmpty(value);
    let str = value.split(':');
    if(parseInt(str[0]) < parseInt(str[1]) == true){
        errMsg = "The "+fieldname+" must be less than "+str[0]+".";
        valid = false;
    }
    return valid;
}
Validation.between = function * (value, fieldname){
    let valid = !_.isEmpty(value);
    let str = value.split(':');
    let sp = str[0].split('-');
    if(parseInt(sp[0]) <= parseInt(str[1]) == false || parseInt(sp[1]) < parseInt(str[1]) == true){
        errMsg = "The "+fieldname+" must be equal or greater than "+sp[0]+" and less than "+sp[1]+".";
        valid = false;
    }
    return valid;
}

Validation.unique = function * (value, fieldname){
    let valid = !_.isEmpty(value);
    let str = value.split(':');
    let sp = str[0].split('-');
    let t = sp[0];
    let f = sp[1];
    if(t && f){
        let email_exist = yield this.checkUnique(t,f,str[1]);
        if(email_exist == true) {
            errMsg = "The "+fieldname+" already exist.";
            valid = false;
        }
    }
    return valid;
}
Validation.isEmail = function * (value, fieldname){
    let valid = !_.isEmpty(value);
    if(v.isEmail(value) == false) {
        errMsg = "Invalid email address.";
        valid = false;
    }
    return valid;
}

//=========Database part=======//
Validation.checkUnique = function *(table, field, value){
    let exist = yield models[table].find({
        where: {
            [field]: value
        }
    });
    if(exist){
        return true;
    }else{
        return false;
    }
}

Validation.getErrorMessage = function * (){
   return errMsg;
}
