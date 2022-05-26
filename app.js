if(!process.env.INSTANCE_TYPE){
  //NEEDS REMOVING WHEN A LIVE UPLOAD IS NEEDED
  require('dotenv').config()
    console.log("dev env variables loaded")	  
}

const express = require("express");
const app = express();
const utils = require("./utils");

const middleware = require('./middleware');
middleware.setup.setupApp(app)

app.listen(process.env.PORT||80, process.env.IP, function(){	
    console.log("Server has started!")
    
    //START THE COMPLETE DOCUMENT CHECKER
    setTimeout(utils.timer.checkTimer, process.env.TIMER_MS);
});