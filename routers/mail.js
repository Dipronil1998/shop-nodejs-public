const nodemailer = require('nodemailer');

let mailTransporter = nodemailer.createTransport({
    service: 'gmail',
	auth: {
		user: process.env.EMAIL,
		pass: process.env.PASSWORD
	}
});

let sendMail = (mailOptions)=>{
	mailTransporter.sendMail(mailOptions, function(err, data) {
		if(err) {
			console.log('Error Occurs');
			console.log(err);
		} else {
			console.log('Email sent successfully');
		}
	});
}

// let mailDetails = {
// 	from: process.env.EMAIL,
// 	to: 'dipronildas.net@gmail.com',
// 	subject: 'Test mail',
// 	text: 'Node.js testing mail for dipronil'
// };


// mailTransporter.sendMail(mailDetails, function(err, data) {
// 	if(err) {
// 		console.log('Error Occurs');
// 		console.log(err);
// 	} else {
// 		console.log('Email sent successfully');
// 	}
// });

// module.exports = { mailTransporter };

module.exports = sendMail;