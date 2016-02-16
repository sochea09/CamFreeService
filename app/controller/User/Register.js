"use strict";

let models = camfree.model;
let utils = camfree.utils;
let debug = require("debug")("camfree:controller:user:register");
let Mailer = require("../../utils/Mailer.js");

//let Register = module.exports = {};
let Register = require("../User/Register.js");
let validation = require("../../utils/Validation.js");

Register.randomCode = function* () {

    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i <25; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
};
Register.create = function * () {

    let rules = [{
            email: 'unique:user-email|required',
            password: 'min:4|required'
        }];

    let validate = validation.validate(this.body, rules);
    var error = validation.getErrorMessage();
    if( validate == false){
        this.ok(error);
    }else{
        console.log('yyyyy');
    }


    return;

    try {
        let validate = registrationValidation.validateRegisterUser(this.body);
        console.log('hello'+validate);return;
        if ( validate !== undefined){
            console.log('scuess');return;
            let email_confirm_code = yield Register.randomCode();
            let uid = yield models.user.newUid(this.body.username || this.body.email);
            let user = yield models.user.create({
                username: this.body.username || uid,
                email: this.body.email,
                country_code: this.body.country_code,
                phone_number: this.body.phone_number,
                password: utils.hash(this.body.password),
                uid: uid,
                email_confirm_code:email_confirm_code,
                access_key: utils.hash((utils.uuidV1())),
                last_login: new Date(),
                is_pw_change: false,
                role_id: 5,
                hash: utils.uuidV1()
            });

            user = user.toJSON();
            //user.profile = profile;
            //user.password = undefined;
            //user.confirm_code = undefined;
            //user.email_confirm_code = undefined;
            //let status_send = Mailer.send(
            //    "Savada Digital Corp Successful Registration.",
            //    this.body.email,
            //    "Savada Digital Corp",
            //    Mailer.registerTemlate(this.body.firstname, this.body.lastname, this.body.email, email_confirm_code));
            //if(status_send) {
            //    console.log("Email sent.");
            //}else{
            //    console.log("Email send failed.");
            //}
            this.ok(user,"Thanks for signing up. Please check your email for confirmation!");
        }else{
            this.ok(validate);
        }
    } catch (err) {
        this.error(err);
    }
};

Register.createCompany = function * () {
    try {
        let uid = (this.body.email) ? yield models.user.newUid(this.body.email) : null;

        // Get role_id
        let role_data = yield models.role.findOne({
            where: {
                name: {
                    $in: ['company', 'private']
                }
            }
        });
        let role_id = 3;
        if (role_data) role_id = role_data["id"];
        let confirm_code = (this.body.company_confirm_code) ? yield Register.checkCompanyConfirmCode(this.body.company_confirm_code) : null;
        let company_status = (confirm_code == null) ? 'pending' : 'verified';

        let company = {};
        if (confirm_code == null) {
            if (CompanyRegisterValidator.validateCompany(this.body) != undefined) {
                company = yield models.user.create({
                    company_name: this.body.company_name,
                    username: uid,
                    email: this.body.email,
                    password: utils.hash(this.body.password),
                    business_type_id: this.body.business_type_id,
                    address: this.body.address,
                    city_id: this.body.city_id,
                    phone_number: this.body.phone_number,
                    uid: uid,
                    access_key: utils.hash((utils.uuidV1())),
                    last_login: new Date(),
                    is_pw_change: false,
                    role_id: role_id,
                    hash: utils.uuidV1(),
                    company_confirm_code: confirm_code,
                    company_status: company_status
                });

                let profile = yield models.profile.create({
                    id: company.id,
                    firstname: this.body.rep_name,
                    lastname: this.body.rep_name
                });

                yield models.userSocial.create({
                    id: company.id
                });

                yield models.member.create({
                    first_name:this.body.rep_name,
                    last_name:this.body.rep_name,
                    phone_number:this.body.phone_number,
                    user_id: company.id
                });

                company = company.toJSON();
                company.profile = profile;
                company.password = undefined;
                company.confirm_code = undefined;
            }

        }


        // Update company_confirm_code
        if (confirm_code != null) {

            let update_code = yield models.companyConfirmCode.update({
                usage_number: 0
            }, {
                where: {
                    code: confirm_code
                }
            });

            company = yield models.user.findOne({
                where: {
                    company_confirm_code: confirm_code
                }
            });

            company = company.toJSON();
            company.password = undefined;
            company.confirm_code = undefined;

            let user_data = yield models.user.update({
                company_status: 'verified'
            }, {
                where: {
                    company_confirm_code: confirm_code
                }
            });
            company.company_status = 'verified';
        }

        this.ok(company);

    } catch (err) {
        this.error(err);
    }
};

Register.checkCompanyConfirmCode = function * (code) {
    try {
        let confirm_code = yield models.companyConfirmCode.findOne({
            where: {
                code: code,
                usage_number: 1
            }
        });
        if (!confirm_code) return null;
        return code;
    } catch (err) {
        console.log(err);
        return null;
    }
};

Register.resetPrivatePassword = function * () {
    try {
        if (!this.body.id || !this.body.confirm_code) {
            return this.fail({}, 'ID or confirm_code are missing.');
        }
        let pwd = utils.hash(this.body.password);
        let user_data = yield models.user.update({
            password: pwd
        }, {
            where: {
                id: this.body.id,
                company_confirm_code: this.body.confirm_code
            }
        });
        if (user_data) {
            let company = yield models.user.findOne({
                where: {
                    id: this.body.id
                }
            });
            company = company.toJSON();
            company.password = undefined;
            company.confirm_code = undefined;

            this.ok(company);
        } else {
            return this.fail({}, 'record not found.');
        }
    } catch (err) {
        this.error(err);
    }
};

Register.verify = function() {
    this.render("home/construction");
};

Register.resendVerify = function() {
    this.render("home/construction");
};
