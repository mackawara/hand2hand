server();
async function server() {
  var express = require("express");

  const path = "path";
  const bodyParser = require("body-parser");

  const cors = require("cors");

  const nodemailer = require("nodemailer");
  const multiparty = require("multiparty");
  //const { request } = require("https");
  require("dotenv").config();

  const multer = require("multer");
  const upload = multer();

  const { MongoClient } = require("mongodb");
  const app = express();
  const port = process.env.PORT;
  const { check, validationResult } = require("express-validator");

  // opens the database connection before the server starts listening so that when are req is made we are redy to save

  const mongoose = require("mongoose");
  const uri =
    "mongodb+srv://mkawara:uyaoDLELgsBnSHud2015@hand2hand.4pnao.mongodb.net/customerFeedback?retryWrites=true&w=majority";

  const databaseName = "customerFeedback";
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbname: databaseName,
  };
  const FeedbackModel = require("./models/feedback");
  let connection = mongoose.connect(uri, options);

  const database = mongoose.connection;

  database.on("error", console.error.bind(console, "connection error:"));
  database.once("open", function () {
    console.log("DAtabase connection established");
    app.listen(port, () => {
      console.log(`Server started, listening on  port: ${port} `);
    });
  });
  app.use(express.static("public"));

  app.use(express.static(__dirname + "/public"));

  app.get("/contactus", (req, res) => {
    res.sendFile(__dirname + "/contactus.html");
  });

  app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
  });
  app.use(
    express.urlencoded({
      extended: false,
    })
  );
  app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  );
  app.use(express.json());
  app.use(upload.array());

  // this middleware configures the dat for saving to the DB

  //receives and formarts data from req object
  let data = {};

  app.post("/send", (req, res, next) => {
    console.log(req.body);
    console.log("received");
    /* let form = new multiparty.Form();

    form.parse(req, function (err, fields) {
      Object.keys(fields).forEach(function (property) {
        data[property] = fields[property].toString();
      });
    }); */

     const fullname = req.body.name;
    const email = req.body.email;
    const subject = req.body.subject;
    const text = req.body.text;
    const mobileNumber = req.body.mobileNumber; 
    /* console.log(data);
    res.send(`${form}, was received thank you`); */
  
  
  const feedback = new FeedbackModel({
    name: fullname,
    email:email,
    subject:subject,
    text:text,
    mobileNumber:mobileNumber,
  });

  feedback.save();

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
      console.log("transorter has verified and is ready to send messages");
    }
  });

  // this middleware configures the dat for saving to the DB

  //input validation using Express validato

  const sender = process.env.EMAIL;
  const receiver = process.env.RECEIVER;
  const mail = {
    from: sender,
    to: receiver,
    subject: feedback.subject,
    text: `From : ${feedback.name} \n Email: <${feedback.email}>  \n Mobile Number:${feedback.mobileNumber}  \n Feedback: ${feedback.text}`,
  };

  transporter.sendMail(mail, (err, res) => {
    if (err) {
      console.error(err);
      // res.status(500).send("Something went wrong.");
    } else {
      res.status(200).send("Email successfully sent to recipient!");
      console.log(`email has been sent succesfully to ${receiver}`);
    }
  });

  //validates and sanitises
  function checkData(err, req, res, next) {
    check(email)
      .isEmail()
      .withMessage("Please enter a valid email")
      .normalizeEmail(),
      check(fullname)
        .isEmpty()
        .isLength({ min: 2, max: 35 })
        .matches(/^[a-z ,.'-]+$/i)
        .withMessage("Plese enter a valid Name"),
      check(mobileNumber)
        .isLength({ min: 10, max: 13 })
        .matches(/^263[7][13478][0-7]{7}$/)
        .isNumeric()
        .withMessage("Please enter a valid Zimbabwean mobile number");

    const errors = validationResult(req);

    if (errors.isEmpty) {
      console.log("Validation passed");
      next();
    } else {
      console.error(errors);
      res.send(errors);
      res.end();
    }
  } 
})
}
/* app.get("/contactus.html", (req, res) => {
  let data = req.body;
  data;
  res.sendFile(process.cwd() + "/public/contactus.html");
});
 */
/* app.route("/").get(function (req, res) {
  //make the contact page the the first page on the appv
  res.sendFile(process.cwd() + "/public/contactus.html"); // The process.cwd() method returns the current working directory of the Node.js process.
}); */
