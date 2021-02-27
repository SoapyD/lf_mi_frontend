const Report = require("../models/report");
const Fusion = require("../models/fusion");
const SubSection = require("../models/subsection");
const databaseQueriesUtil = require('../util/database_queries');



exports.createFusion = async(req,res) => { //, middleware.isLoggedIn

    let fusions = await databaseQueriesUtil.destroyFusions(
        Number(req.params.reportid), "subsection", "report")

    // let sections = req.body.sections;
    // let f_sections = sections.filter(element => element !== "1"); //REMOVE ALL INSTANCES OF THE BLANK SECTION


    // let creations = await databaseQueriesUtil.recreateSectionFusions(req.params.reportid, f_sections)

    let sections = req.body.Report

    //LOOP THROUGH SECTION KEYS
    for(const section_key in sections){ 
        // console.log(section_key)

        let subsection_order = 1
        for(const subsection_key in sections[section_key]){ 
	        let subsection = sections[section_key][subsection_key]
            // console.log(val)
            if (subsection_key.includes("Sub Section")){
                // if(subsection)
                // console.log(subsection)
                if(subsection.id !== "1"){
                    databaseQueriesUtil.createFusion(subsection_order, subsection.id, 'subsection', req.params.reportid, 'report')

                    subsection_order++
                }
            }
        }
    }

    // console.log(fusions)
    req.flash("success", "Report Updated");    
    res.redirect("/reports/" +req.params.reportid)
};