const nodemailer = require('nodemailer');

const mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL,
        pass: process.env.MAIL_PASSWORD
    }
});

const registrationMail = (email, name) => {
    const subject = "Welcome to Editor-Pro - Your Ultimate Document Collaboration Platform!"
    const text = `<p>Dear ${name},</p>\n
    <p>Welcome to Editor-Pro, the ultimate web app that revolutionizes the way you collaborate, share, edit, and compile documents. We are thrilled to have you on board, and we can't wait for you to explore the endless possibilities that Editor-Pro offers.</p>\n
    <p>As a newly registered user, you now have access to a wide range of powerful features designed to streamline your document collaboration process. Here are some key highlights:</p>\n
    <ul>
        <li>1. Real-Time Collaboration: Say goodbye to version control nightmares and welcome seamless collaboration with Editor-Pro. Our innovative system allows over 50 users to edit and share files simultaneously, enabling true teamwork in real time.</li>
        <li>2. Lightning-Fast Performance: We understand the importance of efficiency, which is why Editor-Pro boasts less than 1-second latency and deadlock prevention. Experience optimal performance as you work on your documents without any disruptions.</li>
        <li>3. Wide Language Support: Whether you're a programmer or a writer, Editor-Pro has got you covered. With support for over 40 programming languages, including Markdown, and Word File, you can seamlessly work on various document types and code snippets.</li>
        <li>4. Robust Security: We prioritize the safety and privacy of your data. Editor-Pro features a secure access management system, ensuring that updates are limited to the original creator. You can collaborate with peace of mind, knowing that your work is protected.</li>
    </ul>\n
    <p>We are constantly working to enhance your experience on Editor-Pro, and we encourage you to provide us with any feedback or suggestions you may have. Our dedicated team is here to listen and assist you every step of the way.</p>\n
    <p>To get started, simply log in to your Editor-Pro account using the credentials you provided during registration. If you have any questions or need assistance, don't hesitate to reach out to our support team at ${process.env.MAIL}. We are always happy to help.</p>\n
    <p>Thank you once again for joining Editor-Pro. Get ready to elevate your collaboration and editing game to new heights!<p>
    <p>Best regards,</p>\n
    <p>Editor-Pro Team</p>`
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

const invitationMail = (userMail, newEmail, owner, fileName, docId) => {
    const subject = "Join the Collaborative Document on Editor-Pro!"
    const text = `<p>Dear ${userMail},</p>\n
    <p>Congratulations! You have been invited to collaborate on Editor-Pro, the leading web app that combines document sharing, editing, and compilation capabilities. We're excited to have you on board and look forward to witnessing the power of teamwork in action</p>\n
    <p>At Editor-Pro, we believe in the strength of collaboration, and your invitation is a testament to that belief. Our platform offers a seamless and efficient environment for real-time collaboration, enabling you and your team to work together effortlessly.</p>\n
    <p>Here are the details of the document:</p>\n
    <p>Document Name: ${fileName}</p>
    <p>Owner: ${owner}</p>
    <p>Invited By: ${userMail}</p>
    <p>Link: ${process.env.CLIENT_URL}/${docId}</p>\n
    <p>With Editor-Pro, you can expect a seamless collaboration experience:</p>\n
    <ul>
        <li>1. Real-Time Editing: You can edit the document simultaneously with other collaborators, ensuring efficient teamwork and real-time updates.</li>\n
        <li>2. Enhanced Performance: Our platform boasts exceptional performance, offering low latency and deadlock prevention, enabling you to work without any disruptions.</li>\n
        <li>3. Language and File Support: Editor-Pro supports over 40 programming languages, including Markdown, and also allows you to work with Word files. You have the flexibility to modify and enhance the document based on your requirements.</li>\n
        <li>4. Secure Access Management: Rest assured that your privacy and document security are of utmost importance to us. The access management system ensures that updates are limited to the original creator, providing a secure environment for collaboration.</li>\n
    </ul>\n
    <p>To get started, simply follow these steps:</p>\n
    <ul>
        <li>1. Click on the link provided in the invitation email or copy and paste it into your browser's address bar.</li>\n
        <li>2. If you don't have an Editor-Pro account yet, you'll be prompted to create one. Don't worry; it's a quick and straightforward process.</li>\n
        <li>3. Once logged in, you'll have instant access to the document you've been invited to collaborate on. Dive in, start editing, and enjoy the collaborative experience!</li>\n
    </ul>\n
    <p>If you have any questions or need assistance along the way, our support team is here to help. Feel free to reach out to us at ${process.env.MAIL}, and we'll be more than happy to assist you.</p>\n
    <p>Thank you for joining Editor-Pro as a collaborator. We can't wait to witness the magic that unfolds when talented minds come together. Let's create something extraordinary!</p>\n
    <p>Best regards,</p>\n
    <p>Editor-Pro Team</p>`
    const mailDetails = {
        from: process.env.MAIL,
        to: newEmail,
        bcc: owner,
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