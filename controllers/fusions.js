// const Report = require("../models/report");
// const Fusion = require("../models/fusion");
// const SubSection = require("../models/subsection");
const databaseQueriesUtil = require('../util/database_queries2');



exports.createFusion = async(req,res) => { //, middleware.isLoggedIn

    //GET ALL CURRENT JOINS
	let id = req.params.reportid;

    try{
		let find_list = []
		find_list.push(
		{
			model: "Report",
			search_type: "findOne",
			params: [{
				where: {
					id: id,
				},
				include: databaseQueriesUtil.searchType['Full Report'].include			
			}]
		}) 

	    //GET FULL REPORT
		let reports = await databaseQueriesUtil.findData(find_list)
        let report = reports[0]

        //CREATE THE SECTIONS AND SUBSECTIONS THAT HAVE BEEN PASSED FROM THE BODY

        let sections = req.body.Report

        for(const section_key in sections){ 
            let subsection_order = 1
            //CREATE SECTION

            let creation_list = []
            let create_sections = {}
            create_sections["model"] = "Section"
            create_sections["params"] = []
            params = {}
            params["where"] = sections[section_key]["params"]
            params["where"]["reportId"] = report.id
            create_sections["params"].push(params)
            creation_list.push(create_sections)
            let created_section = await databaseQueriesUtil.createData(creation_list)

            creation_list = []
            create_sections = {}
            create_sections["model"] = "SectionSubSection"
            create_sections["params"] = []
            
            for(const subsection_key in sections[section_key]){ 
                let subsection = sections[section_key][subsection_key]
    
                if (subsection_key.includes("Sub Section")){
    
                    if(subsection.id !== ""){

                        params = {}
                        params["where"] = {}
                        params["where"]["name"] = subsection["params"]["name"]
                        params["where"]["order"] = 0
                        params["where"]["sectionId"] = created_section[0][0].id
                        params["where"]["subsectionId"] = subsection["params"]["id"]

                        create_sections["params"].push(params)
                        creation_list.push(create_sections)
                    }
                }
            }

            let created_sectionsubsections = await databaseQueriesUtil.createData(creation_list)
            //CREATE SUBSECTIONS

            //CREATE SECTIONSUBSECTIONS
            req.flash("success", "Report Updated"); 
            res.redirect("/reports/"+ id)
        }        


        //DESTROY ANY CURRENT JOINS THAT AREN'T IN THE NEWLY CREATED ONES        

    }
	catch(err){
		console.log(err)
		req.flash("error", "There was an error trying to update your report");
		res.redirect("/reports/"+ id)        
    }
    



    // databaseQueriesUtil.getFusions(req.params.reportid, 'SubSection', "Report")
    // .then((current_fusions) => {
    //     databaseQueriesUtil.createSectionFusionsFromBody(req.params.reportid, req.body.Report)
    //     .then((fusions)=> {
    //         // console.log(fusions)

    //         //LOOP THROUGH FUSIONS
    //         let id_list = []
    //         current_fusions.forEach((current_fusion) => {
    //             let found = fusions.find(element => element[0].join_from_id === current_fusion.join_from_id && element[0].join_from === current_fusion.join_from);                                
    //             if(found == null)
    //             {
    //                 id_list.push(current_fusion.id)
    //             }                            
    //         })

    //         if(id_list){
    //             databaseQueriesUtil.destroyFusionsByID(id_list)
    //             .then((result) => {
    //                 req.flash("success", "Report Updated");    
    //                 res.redirect("/reports/" +req.params.reportid)
    //             })
    //         }
    //         else{
    //             req.flash("success", "Report Updated");    
    //             res.redirect("/reports/" +req.params.reportid)     
    //         }

    //     })
    // })


};