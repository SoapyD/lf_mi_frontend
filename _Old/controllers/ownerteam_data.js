

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
            include: databaseHandler.searchType['OrgUnit'].include			
        }]
    }) 

    //GET FULL REPORT
    let orgunits = await databaseHandler.findData(find_list)
    let orgunit = orgunits[0]

    res.render("ownerteam_data/index", {title:"Ownerteam Data", orgunit:orgunit})
	
};