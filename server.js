var express = require("express");
const http = require("http");
var path = "path";
var bodyParse = "body-parser";
const os = require("os");
const totalMemory = os.totalmem;

const nodemailer = require("nodemailer");
const multiparty = require("multiparty");
const { request } = require("https");
require("dotenv").config();

const app = express();
const port = process.env.PORT;
app.use(
  express.urlencoded({
    extended: false,
  })
);
//app.use(express.json());
/* const EventEmitter = require("events"); // creates events emitter class
const emitter = new EventEmitter(); // creates an instance of the event emitter class
 */
var server = app.listen(port, () => {
  console.log(`Listening at port ${port}`);
});
app.get("/search/product", displayData, showMore);
function displayData(req, res, next) {
  res.send("Search for prodct");
  console.log("display");
  next();
}
function showMore(req, res, next) {
  console.log("show more");
}
app.get("/contactus", (req, res) => {
  res.sendFile(process.cwd() + "/public/contactus.html");
  console.log("contactus");
});

app.post("/send", (req, res) => {
  let data = req.body;
  console.log(data, "this works");
  res.send(data);
  /* data.parse(req, function (err, fields) {
    console.log(data);
  }); */
});

/* app.use(express.static("public"), logger);
function logger() {
  console.log("logger working");
} */
const transporter = nodemailer.createTransport({
  host: "smtp-mail.outlook.com", //replace with your email provider
  port: 587,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});

// verify connection configuration
transporter.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take our messages");
  }
});
/* 
app.post("/public/contactus.html", (req, res) => {
  res.
  let form = new multiparty.Form();
  let data = {};
  form.parse(req, function (err, fields) {
    console.log(fields);
    Object.keys(fields).forEach(function (property) {
      data[property] = fields[property].toString();
    });
    console.log(data);
    const sender = process.env.EMAIL;
    const receiver = process.env.RECEIVER;
    console.log(sender, receiver);
    const mail = {
      sender: sender,
      to: receiver, // receiver email,
      subject: data.subject,
      text: `${data.name} <${data.email}> \n${data.message}`,
    };

    transporter.sendMail(mail, (err, data) => {
      if (err) {
        console.log(err);
        res.status(500).send("Something went wrong.");
      } else {
        res.status(200).send("Email successfully sent to recipient!");
      }
    });
  });
});
 */

app.get("/contactus.html", (req, res) => {
  let data = req.body;
  data;
  res.sendFile(process.cwd() + "/public/contactus.html");
});

app.route("/").get(function (req, res) {
  //make the contact page the the first page on the appv
  res.sendFile(process.cwd() + "/public/contactus.html"); // The process.cwd() method returns the current working directory of the Node.js process.
});
