server();
async function server() {
  var express = require("express");

  const path = "path";
  const bodyParser = require("body-parser");

  const cors = require("cors");

  const sendMail = require("./middleware/sendmail");
  const multiparty = require("multiparty");
  //const { request } = require("https");
  require("dotenv").config();

  const multer = require("multer");
  const upload = multer();

  const saveToDataBase = require("./middleware/saveToDatabase");

  const app = express();
  const  port = process.env.PORT || 8080
  const {validationRules, validate} = require("./middleware/validation");
  //const { body,  } = require("express-validator");
  let ejs = require("ejs");

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
  //const FeedbackModel = require("./models/feedback");
  let connection = mongoose.connect(uri, options);

  const database = mongoose.connection;

  database.on("error", console.error.bind(console, "connection error:"));
  database.once("open", function () {
    console.log("DAtabase connection established");
    app.listen(port, () => {
      console.log(`Server started, listening on  port: ${port} `);
    });
  });
  /* app.set("views",path.join(__dirname, "views"))
  app.set("view engine", "ejs") */
  app.use(express.static("public"));

  app.use(express.static(__dirname + "/public"));

  app.use(express.json());
  app.use(upload.array());

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

  app.post(
    "/send",validationRules(),validate, saveToDataBase, sendMail,
    

    (req, res, next) => {
      
     console.log(req.body.subject);
      console.log("received");
      //res.status(200).render();

      /*  form.parse(req, function (err, fields) {
      Object.keys(fields).forEach(function (property) {
        data[property] = fields[property].toString();
      });
    });  */
      //res.render(__dirname + "/views/contactus.ejs")
    }
  );

  app.get("*", (req, res) => {
    res.status("404");

    res.render(__dirname + "/views/404.ejs");
  });
  //render(__dirname + "/views/conpntactus.ejs"));
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
