const nodemailer = require("nodemailer");

require("dotenv").config();
let sendMail = (req, res, next) => {
  console.log("send mail is working");
  const transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com", //replace with your email provider
    port: 587,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS,
    },
  });
  // verify if nodemailer is authorized to send emails from that address.
  transporter.verify(function (error, success, next) {
    if (error) {
      console.log(error);
    } else {
      console.log("transporter has verified and is ready to send messages");
    }
  });

  // this middleware configures the dat for saving to the DB

  //input validation using Express validato

  const sender = process.env.EMAIL;
  const receiver = process.env.RECEIVER;
  const mail = {
    from: sender,
    to: receiver,
    subject: req.body.subject,
    text: `From : ${req.body.name} \n 
      Email: <${req.body.email}>  \n
       Mobile Number:${req.body.mobileNumber}  \n
        Feedback: ${req.body.text}`,
  };

  transporter.sendMail(mail, (err, res) => {
    if (err) {
      console.error(err);
      res.status(500).send("Something went wrong.");
    } else {
      res.status(200).send("Email successfully sent to recipient!");
      console.log(`email has been sent succesfully to ${receiver}`);
    }
  }); 
  next();
};
module.exports = sendMail;
