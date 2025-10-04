const nodemailer = require('nodemailer');
const config = require('../config/config');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.emailUser,
    pass: config.emailPass,
  },
});

exports.sendEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: config.emailUser,
      to,
      subject,
      text,
    });
    console.log('Email sent to:', to);
  } catch (err) {
    console.error('Email error:', err);
  }
};