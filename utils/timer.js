const emailUtil = require('../utils/email');

const checkOutputsUtil = require('../utils/check_output_files');
const ssrs = require('../utils/ssrs3');
const fs = require('fs');

exports.checkTimer = async() => {


    try{

        exports.checkIncompleteSubActivity ()
    }    
    catch(err){
        console.log("ERROR TRYING TO RUN TIMER")
        console.log(err)
        // req.flash("error", "There was an error trying to get queued reports");
        // res.redirect("/")        
    }

    setTimeout(exports.checkTimer, process.env.TIMER_MS);
}


exports.checkIncompleteSubActivity = async() => {

    let find_list = []
    find_list.push(
    {
        model: "SubscriptionActivity",
        search_type: "findAll",
        params: [{
            where: {
                running: 1,
            }		
        }]
    }) 

    //GET ALL REPORT DATA
    let subscriptionactivities = await databaseHandler.findData(find_list)

    subscriptionactivities[0].forEach( async(subscriptionactivity) => {
        checkOutputsUtil.runCheck(subscriptionactivity)
    })

    //IF THERE AREN'T ANY ACTIVITIES RUNNING, RESET REPORT_RUNNING PARAM
    if(subscriptionactivities[0].length === 0){
        ssrs.report_running = false;
    }



    find_list = []
    find_list.push(
    {
        model: "QueuedMerge",
        search_type: "findAll",
    }) 

    //RESET MERGE RUNNING IF THERE AREN'T ANY MERGES TO RUN
    let queuedmerges = await databaseHandler.findData(find_list)
    if(queuedmerges[0].length === 0){
        checkOutputsUtil.merge_running = false;
    }

}