const emailUtil = require('../utils/email');
const databaseQueriesUtil = require('../utils/database_queries2');
const mergeDocumentUtil = require('../utils/merge_document');
const functions = require('../utils/functions');
const ssrs = require('../utils/ssrs3');

const classes = require('../classes');

const fs = require('fs');
const path = require('path');




exports.runCheck = async(subscriptionactivity) => {

    try{

        let subsection_activity = JSON.parse(subscriptionactivity.subsection_activity)
    
        let total_complete_files = 0;
        let total_errors = 0;
        let reran_files = 0;
    
        //CHECK IF FILE EXISTS
        let files_check = 0;
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
                        if(minutes_since_updated > Number(process.env.MINS_SINCE_UPDATED)){
    
                            files_check++;
                            
                            if(subsection.tries > 0){
                                subsection.tries--;
                                subscriptionactivity.last_updated = timestamp_now;
                                subscriptionactivity.reruns++;
    
                                let options = {
                                    name: subsection.name,
                                    delay_timer: subsection.delay_timer, 
                                    filepath: subsection.path, 
                                    parameters: subsection.parameters, 
                                    output_path: subscriptionactivity.path, 
                                    output_file: subsection.output_path,
                                    activity_id: subscriptionactivity.id,
                                    file_type: subscriptionactivity.file_type,
                                    file_extension: subscriptionactivity.file_extension
                                }
    
                                // exports.runDelay(options)
                                let creation_list = [];
                                creation_list.push(
                                    {
                                        model: "QueuedSubsection",
                                        params: [
                                            {
                                                options: JSON.stringify(options),
                                                subscriptionActivityId: subscriptionactivity.id
                                            }
                                        ]
                                })
    
                                let queuedsubsections = await databaseQueriesUtil.createData2(creation_list)  
    
                                // ssrs.report_running = false;
                                // ssrs.checkList();
        
                                reran_files++;
                            }
                            else{
                                //OUT OF TRIES
                                if(!subsection.error){
                                    subsection.error = "generic error: report finished but no file to show for it"
                                }
                                // ssrs.report_running = false;
                                // ssrs.checkList();
                                total_errors++;
                                subsection.running = false;
                            }
                            /**/
                            // if(!subsection.error){
                            //     subsection.error = "generic error: report finished but no file to show for it"
                            // }
                            // ssrs.report_running = false;
                            // ssrs.checkList();
                            // total_errors++;
                            // subsection.running = false;
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

        if(files_check > 0){
            ssrs.report_running = false;
            ssrs.checkList();
        }

    
        let report_timed_out = false;
        let timestamp_now = Date.now();
        let minutes_since_updated = functions.timeDifference(timestamp_now, subscriptionactivity.updatedAt)
        if(total_complete_files + total_errors !== subscriptionactivity.files_expected &&
            minutes_since_updated > Number(process.env.MINS_SINCE_UPDATED)*2 &&
            total_complete_files > 0){
    
            //CHECK TO SEE IF THERE'S ANY PENDING SUBSECTION RUNS
            let find_list = []
            find_list.push(
            {
                model: "QueuedSubsection",
                search_type: "findAll",
                params: [{
                    where: {
                        subscriptionActivityId: subscriptionactivity.id,
                    }		
                }]
            }) 
        
            //GET ALL REPORT DATA
            let subscriptionactivities = await databaseQueriesUtil.findData(find_list)
    
            //DON'T SET TO ERROR IF THERE'S STILL ACTIVITIES LEFT TO RUN
            if(subscriptionactivities[0].length === 0){
    
                files_check = 0;
                //RERUN ANY FILES IF THEY'RE STILL SET TO "RUNNING"
                for(const key in subsection_activity){
                    let subsection = subsection_activity[key];
    
                    //IF HAS STARTED AND IS RUNNING
                    if(subsection.running === true && !subsection.start){
    
                        if(subsection.tries > 0){
                            subsection.tries--;
                            subscriptionactivity.last_updated = timestamp_now;
                            subscriptionactivity.reruns++;
    
                            let options = {
                                name: subsection.name,
                                delay_timer: subsection.delay_timer, 
                                filepath: subsection.path, 
                                parameters: subsection.parameters, 
                                output_path: subscriptionactivity.path, 
                                output_file: subsection.output_path,
                                activity_id: subscriptionactivity.id,
                                file_type: subscriptionactivity.file_type,
                                file_extension: subscriptionactivity.file_extension
                            }
    
                            // exports.runDelay(options)
                            let creation_list = [];
                            creation_list.push(
                                {
                                    model: "QueuedSubsection",
                                    params: [
                                        {
                                            options: JSON.stringify(options),
                                            subscriptionActivityId: subscriptionactivity.id
                                        }
                                    ]
                            })
    
                            let queuedsubsections = await databaseQueriesUtil.createData2(creation_list)  
    
                            files_check++;
                        }
                        else{
                            subsection.running = false;
                        }
                    }
                }
    
                if(files_check === 0){
                    report_timed_out = true;
                    total_errors = subscriptionactivity.files_expected - total_complete_files;
                    subscriptionactivity.log = "error: reports still in running status but check process timed out"
                    ssrs.report_running = false;
                    ssrs.checkList();            
                }
                else{
                    ssrs.report_running = false;
                    ssrs.checkList();                    
                }
            }
        }
    
    
        if(total_complete_files + total_errors === subscriptionactivity.files_expected){
    
    
            ssrs.report_running = false;
    
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
                        subscriptionactivity_id: subscriptionactivity.id,
                        file_path: subscriptionactivity.path,
                        output_name: output_name
                    }
                    // const mergeInstance = new classes.MergeDocument(options)
                    // mergeInstance.runMerge() 
                    
                    //ADD PROCESS TO MERGE TABLE
    
                    let creation_list = [];
                    creation_list.push(
                        {
                            model: "QueuedMerge",
                            params: [
                                {
                                    options: JSON.stringify(options),
                                    subscriptionActivityId: subscriptionactivity.id
                                }
                            ]
                    })         
                
            
                    let queuedmerges = await databaseQueriesUtil.createData2(creation_list) 
    
                    exports.checkList();
    
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
    catch(err){
        console.log("ERROR TRYING TO CHECK FILES")
        console.log(err)
        // req.flash("error", "There was an error trying to get queued reports");
        // res.redirect("/")        
    }

}

// exports


// let report_list = []; //TURNED INTO A TABLE
exports.merge_running = false;



exports.checkList = async() =>{
    if(exports.merge_running === false){

        exports.merge_running = true;

        //GET REPORT LIST
        let find_list = [];

        find_list.push(
        {
            model: "QueuedMerge",
            search_type: "findAll",
        })         

        try{
            let queuedmerges = await databaseQueriesUtil.findData(find_list)
            let merge_list = queuedmerges[0]        

            if(merge_list.length > 0){
                
                let first_queued = merge_list[0]
                let options = JSON.parse(first_queued.options);

                let find_list = []
                find_list.push(
                {
                    model: "SubscriptionActivity",
                    search_type: "findOne",
                    params: [{
                        where: {
                            id: options.subscriptionactivity_id
                        }		
                    }]
                }) 
            
                //GET ALL REPORT DATA
                let subscriptionactivities = await databaseQueriesUtil.findData(find_list)

                options.subscriptionactivity = subscriptionactivities[0];              
                
                //DELETE THE ELEMENT FROM THE QUEUE

                let destroylist = []
                destroylist.push({
                    model: "QueuedMerge",
                    search_type: "findOne",
                    params: [
                        {
                            where: {
                                id: first_queued.id
                            }
                        }
                    ]
                })

                deletions = await databaseQueriesUtil.destroyData(destroylist)

                const mergeInstance = new classes.MergeDocument(options)
                mergeInstance.runMerge()                   

            }
        }
        catch(err){
            console.log("ERROR TRYING TO FIND QUEUE DATA")
            console.log(err)
            // req.flash("error", "There was an error trying to get queued reports");
            // res.redirect("/")        
        }
    }
}






exports.deleteTemp = (output_path) => {

    if(output_path.includes('tmp')){
        console.log("Deleting temp folder: "+output_path)
        fs.rmdirSync(output_path, { recursive: true });
    }
}

