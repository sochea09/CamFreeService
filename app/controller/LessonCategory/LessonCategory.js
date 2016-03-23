"use strict";

let models = camfree.model;
let utils = camfree.utils;
let debug = require("debug")("camfree:controller:lessoncategory:create");
let validation = require("../../utils/Validation.js");

let LessonCategory = module.exports = {};

LessonCategory.create = function * () {
    try{
        let rules = [{
            description: 'required',
            title: 'required'
        }];

        let validate = yield validation.validate(this.body, rules);
        var error = yield validation.getErrorMessage();
        if( validate == false){
            this.fail(error);
        }else {
            let orderNum = yield models.lesson_category.maxOrder();

            let lessonCategory = yield models.lesson_category.create({
                title: this.body.title,
                description: this.body.description,
                order: orderNum,
                created_by: this.auth.id
            });
            lessonCategory = lessonCategory.toJSON();
            this.ok(lessonCategory);
        }
    }catch(err){
        this.error(err);
    }
}