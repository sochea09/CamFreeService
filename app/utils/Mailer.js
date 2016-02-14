"use strict";

let Mailer = module.exports = {};
let email = require("emailjs/email");
let smtpTransport = email.server.connect({
    user: "testingsavada@@gmail.com",
    password: "testing2015",
    host: "smtp.gmail.com",
    ssl: true
});
Mailer.send = function (subject, recever_list, from, html) {
    let status = false;
    let mail = {
        from: from,
        to: recever_list,
        subject: subject,
        attachment: [{
            data: html,
            alternative: true
        }]
    };
    smtpTransport.send(mail, function (error, response) {

        if (error) {
            console.log(error);
            status = false;
        } else {
            console.log("Message sent: " + response);
            status = true;
        }
        //smtpTransport.close();
    });
    return status;
};
Mailer.sendMail = function (subject, recever_list, from, html) {

    let mail = {
        from: from,
        to: recever_list,
        subject: subject,
        attachment: [{
            data: html,
            alternative: true
        }]
    };
    smtpTransport.send(mail, function (error, response) {

        if (error) {
            console.log(error);
        } else {
            console.log("Message sent: " + response);
        }
    });
};
Mailer.registerTemlate = function (firstname, lastname, username, email_confirm_code) {

    let body = "<br> Dear " + firstname + " " + lastname + "<br><br>";
    body += "Thank you for your registration.<br><br>";
    body += "Your account has been recorded in the Savada Digital Corp system. Please use the<br>";
    body += "following username to login the Savada Application<br><br>";
    body += "- Username: " + username + "<br><br>";
    body += "- Before use this account, Please activate your account first: ";
    body += '<a href="https://api-dev.savada.com/user/confirm-email/'+email_confirm_code+'" target="_blank">Activate Account</a><br>';
    body += "<br>Regards,<br><br>";
    body += "Savada  Digital Corp<br>";
    body += 'Website: <a href="http://dev.savada.com"  target="_blank">http://dev.savada.com</a><br><br>';
    return body;
};
Mailer.resetPasswordTemlate = function (email, code) {

    let body = "<br> Dear User<br><br>";
    body += "You're receiving this email because you requested a password reset for the user<br><br>";
    body += "Email: " + email + "<br>";
    body += "Validation Code:  <b>" + code + "</b><br><br>";
    body += 'Website: <a href="http://dev.savada.com"  target="_blank">http://dev.savada.com</a><br><br>';
    return body;
};

Mailer.inviteJoinEventTemlate = function (firstname, lastname, body_data) {

    let body = "<br> Dear " + firstname + " " + lastname + "<br><br>";

    body += "This message invite your to join an events: <br><br>";
    body += "- Event Name: " + body_data + "<br>";
    body += "- Start Date: " + body_data + "<br>";
    body += "- End Date: " + body_data + "<br>";
    body += "- Start Time: " + body_data + "<br>";
    body += "- End Time: " + body_data + "<br>";
    body += "- Location : " + body_data + "<br>";
    body += "<br>Regards,<br><br>";
    body += "Savada  Digital Corp<br>";
    body += 'Website: <a href="http://dev.savada.com"  target="_blank">http://dev.savada.com</a><br><br>';
    return body;
};

Mailer.setPasswordTemplate = function (email, code) {
    let body = "<br>Dear User<br><br>";
    body += "You're receiving this email because you need to set a password to be able to use Savada.<br><br>";
    body += "Email: " + email + "<br>";
    body += "Validation Code:  <b>" + code + "</b><br><br>";
    body += 'Website: <a href="http://dev.savada.com"  target="_blank">http://dev.savada.com</a><br><br>';
    return body;
};

Mailer.verifiedTemplate = function () {
    let body = "<br>Dear User<br><br>";
    body += "You're receiving this email because your account on Savada has been verified and is ready to use.<br><br>";
    body += 'Website: <a href="http://dev.savada.com"  target="_blank">http://dev.savada.com</a><br><br>';
    return body;
};

Mailer.rejectCompanyTemplate = function () {
    let body = "<br>Dear User<br><br>";
    body += "You're receiving this email because your account has been rejected by Savada Digital Corp.<br><br>";
    body += 'Website: <a href="http://dev.savada.com"  target="_blank">http://dev.savada.com</a><br><br>';
    return body;
};
