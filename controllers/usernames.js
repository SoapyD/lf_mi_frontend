

const utils = require("../utils");


exports.getAll = async(req,res) => {
	
    res.render("usernames/index", {title:"Username Matching"})
	
};