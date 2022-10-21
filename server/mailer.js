const nodemailer = require("nodemailer");

const sendResetEmail = (target) => {
  try {
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      auth: {
        user: process.env.MAILER_USER,
        pass: process.env.MAILER_PASSWORD,
      },
    });

    transporter.verify().then(console.log).catch(console.error);

    let mailOptions = {
      from: `SchreckNet <${process.env.MAILER_USER}>`,
      to: target,
      subject: "Elysium Password Reset",
      text: "Holy poop it worked",
    };

    transporter.sendMail(mailOptions, function (err, succ) {
      if (err) {
        console.log(err);
      } else {
        console.log("Email sent successfully.");
      }
    });
    console.log("Email sent!");
  } catch (err) {
    console.log(err);
  }
};

module.exports = { sendResetEmail };
