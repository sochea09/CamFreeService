"use strict";

let models = camfree.model;
let utils = camfree.utils;
let debug = require("debug")("camfree:controller:lesson:create");
let validation = require("../../utils/Validation.js");

let Lesson = module.exports = {};

Lesson.create = function * () {
    try{
        let rules = [{
            lesson_category_id: 'required',
            description: 'required',
            title: 'required'
        }];

        let validate = yield validation.validate(this.body, rules);
        var error = yield validation.getErrorMessage();
        if( validate == false){
            this.fail(error);
        }else {
            let orderNum = yield models.lesson.maxOrder();

            let lesson = yield models.lesson.create({
                title: this.body.title,
                description: this.body.description,
                begin_file_name: (this.body.begin_file_name) ? this.body.begin_file_name : '',
                finish_file_name: (this.body.finish_file_name) ? this.body.finish_file_name : '',
                vdo_id : (this.body.vdo_id) ? this.body.vdo_id : '',
                order: orderNum,
                lesson_category_id: this.body.lesson_category_id,
                created_by: this.auth.id
            });
            lesson = lesson.toJSON();
            this.ok(lesson);
        }
    }catch(err){
        this.error(err);
    }
}
