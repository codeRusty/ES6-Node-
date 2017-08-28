var nodemailer = require('nodemailer');

export default class Mailer {
    constructor(from, to, subject, text, html) {
        this.from = from;
        this.to = to;
        this.subject = subject;
        this.text = text;
        this.html = html;
    }
    send() {
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
}




