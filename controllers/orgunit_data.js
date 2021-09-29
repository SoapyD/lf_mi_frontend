

const utils = require("../utils");


exports.getAll = async(req,res) => {
	
    // let find_list = []
    // find_list.push(
    // {
    //     model: "Report",
    //     search_type: "findAll"
    // }) 

    // try{
    //     let reports = await utils.queries.findData(find_list)
    //     res.render("reports/index", {reports:reports[0]});
    // }
    // catch(err){
    //     console.log(err)
    //     req.flash("error", "There was an error trying to get report data");
    //     res.redirect("/")        
    // }
    res.render("orgunit_data/index", {title:"OrgUnit Data"})
	
};