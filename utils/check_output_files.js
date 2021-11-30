const emailUtil = require('../utils/email');
const databaseQueriesUtil = require('../utils/database_queries2');
const mergeDocumentUtil = require('../utils/merge_document');
const functions = require('../utils/functions');
const ssrs = require('../utils/ssrs3');

const classes = require('../classes');

const fs = require('fs');
const path = require('path');


exports.runCheck = async(subscriptionactivity) => {

    let subsection_activity = JSON.parse(subscriptionactivity.subsection_activity)

    let total_complete_files = 0;
    let total_errors = 0;
    let reran_files = 0;

    //CHECK IF FILE EXISTS
    for(const key in subsection_activity){
        let subsection = subsection_activity[key];

        //IF HAS STARTED AND IS RUNNING
        if(subsection.running === true){
            if(subsection.start){

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
                    if(minutes_since_updated > 15){
                        if(subsection.tries > 0){
                            subsection.tries--;
                            subscriptionactivity.last_updated = timestamp_now;
                            subscriptionactivity.reruns++;
                            
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
                            ssrs.checkList();
    
                            reran_files++;
                        }
                        else{
                            //OUT OF TRIES
                            subscriptionactivity.errors++;
                        }
                    }
                }
            }
        }else{
            if(subsection.error){
                total_errors++;
            }else{
                total_complete_files++;
            }
        }
    }


    if(total_complete_files + total_errors === subscriptionactivity.files_expected){

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

        if(total_errors === 0){
            //MERGE REPORT AND SEND
            let output_name = subscription.report_name+"_"+subscription.report_sub_name
            
            //MERGE DOCUMENT
            if(process.env.MERGE_METHOD == 'DOCX-MERGER'){
                await mergeDocumentUtil.mergeDocument(output_name, subscriptionactivity.path)
                subscriptionactivity.merge_complete = 1
                subscriptionactivity.document_saved = 1
                //SAVE DOCUMENT TO STORAGE
                await emailUtil.email(subscription, output_name+".docx",path.join(subscriptionactivity.path,output_name+'.'+subscriptionactivity.file_extension))
                subscriptionactivity.email_sent = 1
                //DELETE FILES AND TEMPORARY FOLDER
                exports.deleteTemp(subscriptionactivity.path)
            }
    
            if(process.env.MERGE_METHOD == 'CLOUDMERSIVE'){
                let options = {
                    subscription: subscription,
                    subscriptionactivity: subscriptionactivity,
                    file_path: subscriptionactivity.path,
                    output_name: output_name
                }
                const mergeInstance = new classes.MergeDocument(options)
                mergeInstance.runMerge()                
            }
        }else{
            //THERE'S BEEN AN ERROR
        }

        //stop the subscription running
        subscriptionactivity.running = 0;
    }

    //need to handle errored activities
    subscriptionactivity.files_current = total_complete_files
    subscriptionactivity.errors = total_errors
    subscriptionactivity.subsection_activity = JSON.stringify(subsection_activity)
    subscriptionactivity.save();


}



exports.deleteTemp = (output_path) => {

    if(output_path.includes('tmp')){
        console.log("Deleting temp folder: "+output_path)
        fs.rmdirSync(output_path, { recursive: true });
    }
}

