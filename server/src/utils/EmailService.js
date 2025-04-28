const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
});

exports.sendWelcome = (to) => {
    transport.sendMail({
        from: 'no-reply@platform.com',
        to,
        subject: 'Ласкаво просимо!',
        text: 'Ваша реєстрація пройдена успішно.'
    });
};