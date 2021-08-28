var express = require("express");
const http = require("http");
var path = "path";
var bodyParse = "body-parser";
const os = require("os");
const totalMemory = os.totalmem;
const cors = require("cors");

const nodemailer = require("nodemailer");
const multiparty = require("multiparty");
const { request } = require("https");
require("dotenv").config();

const { MongoClient } = require("mongodb");
const app = express();
const port = process.env.PORT;
const { check, validationResult } = require("express-validator");
const mongoose = require("mongoose");
const { error, timeStamp } = require("console");

const uri =
  "mongodb+srv://mkawara:uyaoDLELgsBnSHud2015@hand2hand.4pnao.mongodb.net/customerFeedback?retryWrites=true&w=majority";

const databaseName = "customerFeedback";
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbname: databaseName,
};
mongoose
  .connect(uri, options, console.log("database connected"))
  .then((result) =>
    app.listen(port, () => {
      console.log(`server listening at port:${port}`);
    })
  )
  .catch((err) => console.log(err));

const database = mongoose.connection;
database.on("error", console.error.bind(console, "connection error:"));
database.once("open", function () {
  console.log("We are connected");
});

console.log(check("ëmail.com").isEmail);
const feedbackSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength:[2, `please enter a valid name`],
    maxlength:[30, `please enter a valid name`],
    match:[/^[a-z ,.'-]+$/ , " Please enter a valid name"]
  },
  subject: {
    type: String,
    required: true,
    maxlength:[30, "Please keep Subject to within 30 characters"] 
  },
  text: {
    type: String,
    required: [true, "Please enter text"],
    maxlength:[350, "Please keep Subject to within 30 characters"],

  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    validate:{
      validator :function(v){
       check(v).isEmail}
    }
  },
  mobileNumber: {
    type: String,
    required: true,
  },
});

const Model = mongoose.model("feedback", feedbackSchema);

const newListing = {
  detail: {
    name: "Lofty",
    rooms: 2,
    bedrooms: 1,
  },
};
/* 
client.connect((err) => {
  
  collection
    .insertOne(newListing, () => {
      //console.log(collection);
      if (err) {
        console.log(err);
      } else {
        console.log("document detail");
      }
    })
    .then(() => {
      const query = {};
      collection.find(query);
      console.log(collection);
    });
  if (err) {
    console.error(err);
  } else {
    console.log(client.db);
  }
}); */

const query = { name: "rating", collection: "listingsAndReviews" }; // this is the query document , specifies the query parameters

//npc nodeclient.close();
//client.connect();
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(express.json());
/* const EventEmitter = require("events"); // creates events emitter class
const emitter = new EventEmitter(); // creates an instance of the event emitter class
 */

app.use(express.static(__dirname + "/public"));

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
    console.log("transorter has verified an is ready to send messages");
  }
});

app.post("/send", (req, res, next) => {
  console.log("received");

  let form = new multiparty.Form();
  let data = {};

  form.parse(req, function (err, fields) {
    Object.keys(fields).forEach(function (property) {
      data[property] = fields[property].toString();
    });

  const fullname=data.fullname
  const email=data.email;
  const mobileNumber=data.mobileNumber
  const subject=data.subject;
  const text=data.text;

  //input validation using Express validato
  
    const feedback = new Model({
      name: fullname,
      email: email,
      subject: subject,
      text:text,
      mobileNumber:mobileNumber
    });

    feedback.save()
  

    const sender = process.env.EMAIL;
    const receiver = process.env.RECEIVER;
    const mail = {
      from: sender,
      to: receiver,
      subject: data.subject,
      text: `From : ${data.fname} ${data.lastname} \n Email: <${data.email}>  \n Mobile Number:${data.mobileNumber}  \n Feedback: ${data.text}`,
    };

    transporter.sendMail(mail, (err, res, data) => {
      if (err) {
        console.error(err);
        // res.status(500).send("Something went wrong.");
      } else {
        res.status(200).send("Email successfully sent to recipient!");
        res.send(`email has been sent succesfully to ${receiver}`);
        
      }
    })
  })
});
function userInputValidator(req, res, next) {
 
 check(fullname).contains()
  const errors = check(req);
  if (!errors.isEmpty) {
    console.log(`there was an error ${errors}`);
    console.log("there was an error");
    return;
  } else {
    res.send("Email was sent succesfully");
    console.log("there was no error");
    next();
  }
}
const {checkSchema}= require ("express-validator");


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
