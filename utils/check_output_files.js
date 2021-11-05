const emailUtil = require('../utils/email');
const databaseQueriesUtil = require('../utils/database_queries2');
const mergeDocumentUtil = require('../utils/merge_document');
const functions = require('../utils/functions');
const ssrs = require('../utils/ssrs3');

const classes = require('../classes');

const fs = require('fs');
const path = require('path');


/*
//ADD THE FILE TO THE SUBSCRIPTION ACTIVITY AND CHECK IF IT'S THEN COMPLETE
exports.checkFiles = async(output_path, reportPath, err) => {

    try{

        let find_list = []
        find_list.push(
        {
            model: "SubscriptionActivity",
            search_type: "findOne",
            params: [{
                where: {
                    path: output_path,
                }		
            }]
        }) 

        //GET ALL REPORT DATA
        let subscriptionactivities = await databaseQueriesUtil.findData(find_list)
        let subscription_activity = subscriptionactivities[0]

        if(subscription_activity){

            //UPDATE THE ERROR VALUE AND MESSAGES IF THERE ARE ANY, ELSE JUST INCREASE FILE COUNT
            if (err){
                // subscription_activity.files_current++
                subscription_activity.errors++
                try {
                    subscription_activity.log += "<p>Error running report: "+reportPath+"</p>"
                    subscription_activity.log += err.body.toString() + '\n'
                } catch (err) {
                    //error
                }
            }
            else{
                subscription_activity.files_current++
            }

            let update_list = []
            update_list.push(
            {
                model: "SubscriptionActivity",
                params: [
                    {
                        files_current: subscription_activity.files_current,
                        errors: subscription_activity.errors,
                        log: subscription_activity.log
                    }
                ]
            }) 

            let subscriptions_updated = await databaseQueriesUtil.updateData(subscription_activity, update_list)	

            subscription_activity = subscriptions_updated[0]

            // exports.checkFileNumber(subscription_activity)
            exports.runCheck(subscription_activity)
        }

    }
    catch (err) {
        console.log("ERROR UPDATING SUBSCRIPTION ACTIVITY")
        console.log(err)

        // exports.checkFiles(output_path, reportPath, err)
    }    
}
*/

exports.runCheck = async(subscriptionactivity) => {

    let subsection_activity = JSON.parse(subscriptionactivity.subsection_activity)

    let total_complete_files = 0;
    let reran_files = 0;

    //CHECK IF FILE EXISTS
    for(const key in subsection_activity){
        let subsection = subsection_activity[key];

        if(subsection.running === true){
            //IF THE FILE HAS BEEN FOUND, UPDATE SUBSECTION TO SAY IT'S NO LONGER RUNNING
            if (fs.existsSync(subsection.output_path+'.'+subscriptionactivity.file_extension)) { 
                subsection.running = false;
                // subscriptionactivity.files_current++;
                total_complete_files++;
            }else{
                //ELSE, CHECK TO SEE HOW LONG IT'S BEEN SINCE THE LAST UPDATE
                let timestamp_now = Date.now();
                let minutes_since_updated = functions.timeDifference(timestamp_now, subsection.last_updated)
                
                //IF THE SECTION HASN'T GENERATED IN THE GIVEN TIME, RERUN IT IF THERE'S "TRIES" AVAILABLE
                if(minutes_since_updated > 5){
                    if(subsection.tries > 0){
                        subsection.tries--;
                        subscriptionactivity.last_updated = timestamp_now;

                        let options = {
                            i: 3000 * reran_files, 
                            filepath: subsection.path, 
                            parameters: subsection.parameters, 
                            output_path: subscriptionactivity.path, 
                            output_file: subsection.output_path,
                            file_type: subscriptionactivity.file_type,
                            file_extension: subscriptionactivity.file_extension
                        }
                        ssrs.runDelay(options)

                        reran_files++;
                    }
                    else{
                        //OUT OF TRIES
                        subscriptionactivity.errors++;
                    }
                }
            }
        }else{
            total_complete_files++;
        }
    }


    if(total_complete_files === subscriptionactivity.files_expected){

        //GET THE SUBSCRIPTION
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

        //MERGE REPORT AND SEND
        let output_name = subscription.report_name+"_"+subscription.report_sub_name
        
        //MERGE DOCUMENT
        if(process.env.MERGE_METHOD == 'DOCX-MERGER'){
            await mergeDocumentUtil.mergeDocument(output_name, subscriptionactivity.path)
            //SAVE DOCUMENT TO STORAGE
            await emailUtil.email(subscription, output_name+".docx",path.join(subscriptionactivity.path,output_name+'.'+subscriptionactivity.file_extension))
            //DELETE FILES AND TEMPORARY FOLDER
            exports.deleteTemp(subscriptionactivity.path)
        }

        if(process.env.MERGE_METHOD == 'CLOUDMERSIVE'){
            let options = {
                subscription: subscription,
                file_path: subscriptionactivity.path,
                output_name: output_name
            }
            const mergeInstance = new classes.MergeDocument(options)
            mergeInstance.runMerge()                
        }

        //stop the subscription running
        subscriptionactivity.running = 0;
    }

    //need to handle errored activities
    subscriptionactivity.files_current = total_complete_files
    subscriptionactivity.subsection_activity = JSON.stringify(subsection_activity)
    subscriptionactivity.save();


}



exports.deleteTemp = (output_path) => {

    if(output_path.includes('tmp')){
        console.log("Deleting temp folder: "+output_path)
        fs.rmdirSync(output_path, { recursive: true });
    }
}



/*
exports.checkFileNumber = async(subscription_activity) => {
    //IF THE FILE COUNT IS EQUAL TO FILES EXPECTED
    if (subscription_activity.files_current + subscription_activity.errors === subscription_activity.files_expected){

        //GET THE SUBSCRIPTION
        find_list = []
        find_list.push(
        {
            model: "Subscription",
            search_type: "findOne",
            params: [{
                where: {
                    id: subscription_activity.subscriptionId,
                }		
            }]
        }) 

        //GET ALL REPORT DATA
        let subscriptions = await databaseQueriesUtil.findData(find_list)
        let subscription = subscriptions[0]

        if(subscription){

            //get report data
            find_list = []
            find_list.push(
            {
                model: "Report",
                search_type: "findOne",
                params: [{
                    where: {
                        id: subscription.reportId,
                    }		
                }]
            }) 

            //GET ALL REPORT DATA
            let reports = await databaseQueriesUtil.findData(find_list)
            let report = reports[0]

            //IF THERE AREN'T ANY ERRORS, MERGE THE DOCUMENT, SAVE IT ONTO STORAGE THEN EMAIL IT OUT
            if(subscription_activity.errors === 0){
                //MERGE REPORT AND SEND
                // let output_name = report.name+"_"+report.id+"_"+subscription.name+"_"+subscription.id
                let output_name = subscription.report_name+"_"+subscription.report_sub_name

                
                //MERGE DOCUMENT
                if(process.env.MERGE_METHOD == 'DOCX-MERGER'){
                    await mergeDocumentUtil.mergeDocument(output_name, subscription_activity.path)
                    //SAVE DOCUMENT TO STORAGE
                    await emailUtil.email(subscription, output_name+".docx",path.join(subscription_activity.path,output_name+".docx"))
                    //DELETE FILES AND TEMPORARY FOLDER
                    exports.deleteTemp(subscription_activity.path)
                    
                }

                if(process.env.MERGE_METHOD == 'CLOUDMERSIVE'){
                    let options = {
                        subscription: subscription,
                        file_path: subscription_activity.path,
                        output_name: output_name
                    }
                    const mergeInstance = new classes.MergeDocument(options)
                    mergeInstance.runMerge()                
                }

            }
            //ELSE EMAIL THE ERROR TO THE USER
            else{
                subscription.subject = 'Error Running Subscription: ' + subscription.name;
                subscription.body = subscription_activity.log                        
                await emailUtil.email(subscription)

                //DELETE FILES AND TEMPORARY FOLDER                    
                exports.deleteTemp(subscription_activity.path)
            }
            
            //SET THE SUBSCRIPTION TO NO LONGER RUNNING
            update_list = []
            update_list.push(
            {
                model: "SubscriptionActivity",
                params: [
                    {
                        running: 0,
                    }
                ]
            }) 
    
            let subscriptions_updated = await databaseQueriesUtil.updateData(subscription_activity, update_list)
        }
    }    
}

*/