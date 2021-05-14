//NEEDS REMOVING WHEN A LIVE UPLOAD IS NEEDED
//require('dotenv').config()

const express = require("express");
const app = express();
const ejs = require("ejs");
const bodyParser = require("body-parser");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const passport = require("passport");
const SamlStrategy = require('passport-saml').Strategy;

const ssrs = require('mssql-ssrs');
const docx = require("docx");
// const DocxMerger = require('./util/docx-merger/index.js');
// const DocxMerger = require('docx-merger');
// var builder = require('docx-builder');

var fs = require('fs');
var path = require('path');

const errorController = require('./controllers/error');

const database = require('./util/database')
const seeds = require('./util/seeds3')
const timerUtil = require('./util/timer');

const TestRoutes = require("./routes/test");
const IndexRoutes = require("./routes/index");
const AdminRoutes = require("./routes/admin");
const ReportsRoutes = require("./routes/reports");
// const FusionsRoutes = require("./routes/fusions");
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

// app.use(function (req, res, next) {
//   res.setHeader(
//     'Content-Security-Policy',
//     "default-src 'self' "
//     +";style-src-elem 'self' "
//     +"https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"
//     +";script-src-elem 'self' "    
//     +"https://code.jquery.com/jquery-2.2.4.min.js "
//     +"https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js " 
//     +"https://cdn.jsdelivr.net/npm/phaser@3.24.1/dist/phaser.min.js "

//     +";img-src * 'self' data:"
//     +";font-src * 'self' "
//   );
//   next();
// });


//SETUP SAML STRATEGY
passport.serializeUser((user, done) => {
	done(null, user);
});

passport.deserializeUser((user, done) => {
	done(null, user);
});

passport.use(new SamlStrategy(
    {
      entryPoint: process.env.SAML_ENTRY_POINT,
      issuer: process.env.SAML_ISSUER,
      callbackUrl: process.env.SAML_CALLBACK,
    },
    function (profile, done) {
      // console.log(profile)
      // console.log(profile["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"])
      return done(null,
        {
          id: profile["http://schemas.microsoft.com/identity/claims/objectidentifier"],
          id_name: profile.nameID,
          role: profile["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
          name: profile["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname"]
        });
    })
  );




//setup routes
app.use(IndexRoutes);
app.use("/test",TestRoutes);
app.use("/admin",AdminRoutes);
app.use("/reports",ReportsRoutes);
// app.use("/reports/:reportid/fusions",FusionsRoutes);
app.use("/reports/:reportid/subscriptions",SubscriptionsRoutes);

database.sequelize
  .sync()
  .then(result => {
    if(process.env._PROCESS_TYPE === 'Dev'){
      seeds.create()
      // seeds.test()
    }
  })
  .catch(err => {
    console.log(err)
  })



app.use(errorController.get404);


// app.listen(80, function(){
app.listen(process.env.PORT||80, process.env.IP, function(){	
    console.log("Server has started!")
    
    //START THE COMPLETE DOCUMENT CHECKER
    setTimeout(timerUtil.checkTimer, process.env.TIMER_MS);
});