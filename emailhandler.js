
const nodemailer = require('nodemailer');
const AdminUserID = '<AdminUserID>';
const Password = '<AdminPassword>';
class EmailHandler {
	constructor () {
		this.transporter = nodemailer.createTransport({
	        service: 'gmail',
			auth: {
				user: AdminUserID,
				pass: Password
			}
    	});
    	this.emailOpts = {};
	}

	setEmailOpts (recepient, subject, text) {
		this.emailOpts = {
			from: AdminUserID,
	        to: recepient,
	        subject,
	        text
	    };
	}

	sendEmail () {
		this.transporter.sendMail(this.emailOpts, (error, info) => {
	        if (error) {
	            return console.log(error);
	        }
	        console.log('Message sent: %s', info.messageId);
	    });
	}
}

module.exports = EmailHandler;