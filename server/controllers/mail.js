const nodemailer = require('nodemailer');

const mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL,
        pass: process.env.MAIL_PASSWORD
    }
});

const registrationMail = (email, name) => {
    const subject = "Welcome to Collab"
    const text = `${name} welcome to collab`
    const mailDetails = {
        from: process.env.MAIL,
        to: email,
        subject: subject,
        text: text
    };
    try {
        mailTransporter.sendMail(mailDetails, function (err, data) {
            if (err) {
                console.log(`ERROR: while sending mail to ${email}`);
                console.error(err);
            } else {
                console.log(`DEBUG: Mail sent to ${email}`);
            }
        });
    } catch (err) {
        console.log(`ERROR: while sending mail to ${email}`);
        console.error(err);
    }
}

const invitationMail = (userMail, newEmail, fileName, docId) => {
    const subject = "Invitation to collaborate"
    const text = `${userMail} invited you to collaborate on document ${fileName}.\nClick here to accept the invitation: ${process.env.CLIENT_URL}/${docId}`
    const mailDetails = {
        from: process.env.MAIL,
        to: newEmail,
        bcc: userMail,
        subject: subject,
        text: text
    };
    try {
        mailTransporter.sendMail(mailDetails, function (err, data) {
            if (err) {
                console.log(`ERROR: while sending mail to ${email}`);
                console.error(err);
            } else {
                console.log(`DEBUG: Mail sent to ${email}`);
            }
        });
    } catch (err) {
        console.log(`ERROR: while sending mail to ${email}`);
        console.error(err);
    }
}

module.exports = {
    registrationMail,
    invitationMail
}