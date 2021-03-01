const Report = require("../models/report");
const Fusion = require("../models/fusion");
const SubSection = require("../models/subsection");
const databaseQueriesUtil = require('../util/database_queries');



exports.createFusion = async(req,res) => { //, middleware.isLoggedIn

    databaseQueriesUtil.getFusions(req.params.reportid, 'SubSection', "Report")
    .then((current_fusions) => {
        databaseQueriesUtil.createSectionFusionsFromBody(req.params.reportid, req.body.Report)
        .then((fusions)=> {
            // console.log(fusions)

            //LOOP THROUGH FUSIONS
            let id_list = []
            current_fusions.forEach((current_fusion) => {
                let found = fusions.find(element => element[0].join_from_id === current_fusion.join_from_id && element[0].join_from === current_fusion.join_from);                                
                if(found == null)
                {
                    id_list.push(current_fusion.id)
                }                            
            })

            if(id_list){
                databaseQueriesUtil.destroyFusionsByID(id_list)
                .then((result) => {
                    req.flash("success", "Report Updated");    
                    res.redirect("/reports/" +req.params.reportid)
                })
            }
            else{
                req.flash("success", "Report Updated");    
                res.redirect("/reports/" +req.params.reportid)     
            }

        })
    })


};