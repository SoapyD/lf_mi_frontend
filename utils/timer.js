const emailUtil = require('../utils/email');
const databaseQueriesUtil = require('../utils/database_queries2');
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
    let subscriptionactivities = await databaseQueriesUtil.findData(find_list)

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
    let queuedmerges = await databaseQueriesUtil.findData(find_list)
    if(queuedmerges[0].length === 0){
        checkOutputsUtil.merge_running = false;
    }

}


/*
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
    let subscriptionactivities = await databaseQueriesUtil.findData(find_list)

    if(subscriptionactivities && subscriptionactivities[0]){

        subscriptionactivities[0].forEach( async(subscriptionactivity) => {

            let update_list = []

            if (fs.existsSync(subscriptionactivity.path)) {
                let file_list = fs.readdirSync(subscriptionactivity.path);

                //IF FILES EXIST, CREATE DOCUMENT
                if(file_list.length + subscriptionactivity.errors >= subscriptionactivity.files_expected){
                    //create the merge document
                    console.log("Subscription has expected number of files")
                    
                    update_list.push(
                    {
                        model: "SubscriptionActivity",
                        params: [
                            {
                                files_current: subscriptionactivity.files_expected - subscriptionactivity.errors,
                            }
                        ]
                    }) 

                    //CORRECT NUMEBR OF FILES
                    let subscriptions_updated = await databaseQueriesUtil.updateData(subscriptionactivity, update_list)

                    //RUN FILE CHECK SYSTEM
                    // checkOutputsUtil.checkFileNumber(subscriptions_updated[0])
                    checkOutputsUtil.runCheck(subscriptions_updated[0])
                }
                else {
                    //IF ACTIVITY IS TOO OLD, END IT
                    let today = new Date()
                    let diffMs = (today - subscriptionactivity.createdAt)
                    var diffMins = diffMs / 60000; // minutes

                    if(diffMins >= process.env.TIMER_REPORT_TIMEOUT_MINUTES) {
                        //EMAIL TO SAY REPORT FAILED
                        console.log("Subscription is Old!")


                        update_list.push(
                        {
                            model: "SubscriptionActivity",
                            params: [
                                {
                                    running: 0
                                }
                            ]
                        }) 
    
                        //CORRECT NUMEBR OF FILES
                        let subscriptions_updated = await databaseQueriesUtil.updateData(subscriptionactivity, update_list)



                        let find_list = []
                        find_list.push(
                        {
                            model: "Subscription",
                            search_type: "findOne",
                            params: [{
                                where: {
                                    id: subscriptionactivity.subscriptionId,
                                }		
                            }]
                        }) 
                
                        //GET ALL REPORT DATA
                        let subscriptions = await databaseQueriesUtil.findData(find_list)
                        let subscription = subscriptions[0]

                        subscription.subject = 'Error Timeout Running Subscription: ' + subscription.name;
                        subscription.body = "<p>The report subscription timed out. Please try running it again</p>"
                        subscription.body += subscriptionactivity.log                        
                        await emailUtil.email(subscription)

                        //DELETE FILES AND TEMPORARY FOLDER                    
                        checkOutputsUtil.deleteTemp(subscriptionactivity.path)

                        //SET RUNNING TO FALSE
                        //EMAIL RECIPIENTS TO SAY THE FILE DIDN'T RUN
                    }

                }
            }
            else{
                console.log("folder doesn't exist")

                //DEACTIVEATE THE SUBSCRIPTION RUN SO THIS MESSAGE DOESN'T OCCUR AGAIN
                update_list.push(
                    {
                        model: "SubscriptionActivity",
                        params: [
                            {
                                running: 0
                            }
                        ]
                    }) 

                //CORRECT NUMEBR OF FILES
                let subscriptions_updated = await databaseQueriesUtil.updateData(subscriptionactivity, update_list)

            }
        })
    }
}
*/