var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");
var bodyParser = require("body-parser");
// Requiring Note and Article models
var Note = require("./models/Note.js");
var Article = require("./models/Article.js");
// var path = require('path');

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

// var PORT = 3000;

// Set initial port, which we will use later in our listener
var PORT = process.envPORT || 3000;

// Initialize Express
var app = express();

// Configure middleware

// Have every request go through router middleware:
// app.use(router);

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Set Handlebars.
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: false }));

// Import routes and give the server access to them.
// var routes = require("./controllers/headlines.js");
// var routes = require("./controllers/notes.js");
// app.use(routes);

// Import routes and give the server access to them.
var router = express.Router();

// Require routes file pass router object
require("./config/routes")(router);

// Have every request go through router middleware
app.use(router);

// Connect to the Mongo DB
// If deployed, use the deployed database. Otherwise, use the local onionscraperdb database
var db = process.env.MONGODB_URI || "mongodb://localhost/onionscraperdb";

mongoose.connect(db, function(error) {
  if (error) {
    console.log(error);
  }
  else {
    console.log("Mongoose connection is successful");
  }
});

// Start the server
app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});
