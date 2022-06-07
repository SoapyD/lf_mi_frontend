

const utils = require("../utils");


exports.getAll = async(req,res) => {
	
    res.render("orgunit_slas/index", {title:"OrgUnit SLAs"})
	
};