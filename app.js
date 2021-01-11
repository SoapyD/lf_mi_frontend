// require('dotenv').config()

const express = require("express");
const app = express();
const ejs = require("ejs");
const bodyParser = require("body-parser");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const passport = require("passport");


const ssrs = require('mssql-ssrs');
// const DocxMerger = require('./util/docx-merger/index.js');
// const DocxMerger = require('docx-merger');
// var builder = require('docx-builder');
const docx = require("docx");

var fs = require('fs');
var path = require('path');

const ssrsController = require('./controllers/ssrs2');
const errorController = require('./controllers/error');

const database = require('./util/database')
const seeds = require('./util/seeds2')

const IndexRoutes = require("./routes/index");
const ReportsRoutes = require("./routes/reports");
const FusionsRoutes = require("./routes/fusions");
const SubscriptionsRoutes = require("./routes/subscriptions");

//setup app
app.set("view engine", "ejs"); //set ejs as the view engine
app.use(bodyParser.urlencoded({ extended: true })); //setup body parser so it can read url parameters
app.use(express.static(__dirname + "/public")); //setup a public folder for js and css
app.use(methodOverride("_method")); //setup means of changing POST methods to DELETE and PUT methods
app.use(flash()); //setup flash messages





//setup sessions
app.use(require("express-session")({
  secret: process.env.SESSION_SECRET, //used to encode and decode sessions
  resave: false,
  saveUninitialized: false
  }));
app.use(passport.initialize());
app.use(passport.session());

//setup the local variables
app.use(function(req, res, next){
	res.locals.user = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");	
	next();
})

//setup routes
app.use(IndexRoutes);
app.use("/reports",ReportsRoutes);
app.use("/reports/:reportid/fusions",FusionsRoutes);
app.use("/reports/:reportid/subscriptions",SubscriptionsRoutes);

database.sequelize
  .sync()
  .then(result => {
    seeds.seed()

  })
  .catch(err => {
    console.log(err)
  })



// console.log(process.env)
app.use(errorController.get404);


// app.listen(80, function(){
app.listen(process.env.PORT||80, process.env.IP, function(){	
    console.log("Server has started!")
    
    //START THE COMPLETE DOCUMENT CHECKER
    setTimeout(ssrsController.checkFiles, 10000);
});