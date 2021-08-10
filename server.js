var express = require("express");
const http = require("http");
var path = "path";
var bodyParse = "body-parser";

const app = express();
const port = 3000;

var server = app.listen(port, (listening) => {
  console.log("Listening at port 3000");
});
app.use(express.static("public"))