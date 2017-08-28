"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var nodemailer = require('nodemailer');

var Mailer = function () {
    function Mailer(from, to, subject, text, html) {
        _classCallCheck(this, Mailer);

        this.from = from;
        this.to = to;
        this.subject = subject;
        this.text = text;
        this.html = html;
    }

    _createClass(Mailer, [{
        key: "send",
        value: function send() {
            // create reusable transporter object using the default SMTP transport
            var smtpTransport = nodemailer.createTransport("SMTP", {
                service: "Gmail",
                auth: {
                    user: "sourabh.rustagi@daffodilsw.com",
                    pass: "$ourabh@1"
                }
            });
            // setup e-mail data with unicode symbols
            var mailOptions = {
                from: this.from, // sender address
                to: this.to, // list of receivers
                subject: this.subject, // Subject line
                text: this.text, // plaintext body
                html: this.html // html body
            };

            // send mail with defined transport object
            smtpTransport.sendMail(mailOptions, function (error, info) {
                if (error) {
                    return console.log(error);
                }
            });
        }
    }]);

    return Mailer;
}();

exports.default = Mailer;