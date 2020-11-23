const express = require("express");
const router = express.Router();
// const ssrsController = require('../controllers/ssrs');

router.get("/", function(req, res) {
    
    // ssrsController.run();

    res.send("hi there you!");
});


module.exports = router;