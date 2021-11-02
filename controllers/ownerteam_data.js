

const utils = require("../utils");


exports.getAll = async(req,res) => {
    
    
    let find_list = []
    find_list.push(
    {
        model: "Data_Orgunit",
        search_type: "findOne",
        params: [{
            where: {
                name: "cafcass",
            },
            include: utils.queries.searchType['OrgUnit'].include			
        }]
    }) 

    //GET FULL REPORT
    let orgunits = await utils.queries.findData(find_list)
    let orgunit = orgunits[0]

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
    res.render("ownerteam_data/index", {title:"Ownerteam Data", orgunit:orgunit})
	
};