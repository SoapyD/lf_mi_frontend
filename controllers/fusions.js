const Report = require("../models/report");
const Fusion = require("../models/fusion");
const Section = require("../models/section");
// const ssrsController = require('../controllers/ssrs');
// const report = require("mssql-ssrs");
const databaseController = require('./database');

// exports.getAllFusions = (req,res) => { //, middleware.isLoggedIn	
//     res.send("This is a test")
// };

// async function test_loop(report_id, f_sections){
//     let processes = []
//     //CREATE FUSIONS BASED ON NEW FUSION LIST
//     f_sections.forEach((section_id, i) => {
//         processes.push(databaseController.createFusion(i+1, 
//             Number(section_id), 'section', //JOIN FROM
//             Number(report_id), 'report' //JOIN TO
//             ))
//     })    

//     return  Promise.all(processes)
// }

exports.createFusion = async(req,res) => { //, middleware.isLoggedIn

    let fusions = await databaseController.destroyFusions(
        Number(req.params.reportid), "section", "report")

    // let sections = req.body.sections;
    // let f_sections = sections.filter(element => element !== "1"); //REMOVE ALL INSTANCES OF THE BLANK SECTION


    // let creations = await databaseController.recreateSectionFusions(req.params.reportid, f_sections)

    let sections = req.body.Report

    //LOOP THROUGH SECTION KEYS
    for(const section_key in sections){ 
        // console.log(section_key)

        let section_order = 1
        for(const subsection_key in sections[section_key]){ 
	        let subsection = sections[section_key][subsection_key]
            // console.log(val)
            if (subsection_key.includes("Section")){
                // if(subsection)
                // console.log(subsection)
                if(subsection.id !== "1"){
                    databaseController.createFusion(section_order, subsection.id, 'section', req.params.reportid, 'report')

                    section_order++
                }
            }
        }
    }

    // console.log(fusions)
    req.flash("success", "Report Sections Updated");    
    res.redirect("/reports/" +req.params.reportid)
};