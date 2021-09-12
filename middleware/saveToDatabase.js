
  //const { MongoClient } = require("mongodb");
  const mongoose = require("mongoose");
  require("dotenv").config();
const { check, validationResult } = require("express-validator");
//const Schema = new mongoose.Schema;

const feedbackSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: [2, `please enter a valid name`],
      maxlength: [30, `please enter a valid name`],
      //match: [/^[a-z ,.'-]+$/ , " Name contains Invalid characters"],
    },
    subject: {
      type: String,
      required: true,
      maxlength: [30, "Please keep Subject to within 30 characters"],
    },
    text: {
      type: String,
      required: [true, "Please enter text"],
      maxlength: [350, "Please keep Subject to within 30 characters"],
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      validate: {
        validator: function (v) {
          check(v).isEmail;
        },
      },
    },
    mobileNumber: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const FeedbackModel = mongoose.model("feedback", feedbackSchema);

 // const FeedbackModel = require("./models/feedback");
  
  let saveToDataBase = (req, res, next) => {
    console.log("save to database is working")
    const fullname = req.body.name;
    const email = req.body.email;
    const subject = req.body.subject;
    const text = req.body.text;
    const mobileNumber = req.body.mobileNumber;
    
    /* console.log(data);
    res.send(`${form}, was received thank you`); */
    const feedback = new FeedbackModel({
  name: fullname,
  email: email,
  subject: subject,
  text: text,
  mobileNumber: mobileNumber,
});

    feedback.save();
    next()
    console.log("saved to database");}
    //module.exports(feedback)=feedback
    module.exports=saveToDataBase
   