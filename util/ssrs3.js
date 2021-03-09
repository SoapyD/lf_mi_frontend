const emailUtil = require('../util/email');
const databaseQueriesUtil = require('../util/database_queries2');
const mergeDocumentUtil = require('../util/merge_document');
const functionsUtil = require('../util/functions');

var fs = require('fs');
var path = require('path');
const tmp = require('tmp');



exports.ssrs = require('mssql-ssrs');
// exports.files = [];


const username = process.env.SSRS_USER;
const password = process.env.SSRS_PASS;
var serverUrl = process.env.SSRS_URL; ///ReportServer2010


exports.run = async(i, report, subscription) => {

    try{

        if (subscription.active === true){

            const tmpobj = tmp.dirSync();
        
            let folder_path = tmpobj.name //'reports';//

            
            let subsection_count = 0;
            if(report.sections){
                report.sections.forEach((section) => {

                    if(section.subsections){
                        subsection_count += section.subsections.length
                    }
                })
            }

            let file_data = {
                folder_path: folder_path,
                files_needed: subsection_count
            }
            
            let creation_list = []
            creation_list.push(
            {
                model: "SubscriptionActivity",
                params: [
                    {
                        path: folder_path,
                        files_expected: file_data.files_needed,
                        subscriptionId: subscription.id
                    }
                ]
            }) 
    
            let subscriptionactivities = await databaseQueriesUtil.createData2(creation_list)	            


            let filepath = '';
            let filename = '';
            let outputname = '';
            let parameter_object = JSON.parse(subscription.parameters);
            let contents_page = '';

            //CREATE THE CONTENT PAGE TEXT
            if(report.sections){

                let subsection_count = 0

                //FORMAT THE CONTENTS PAGE
                report.sections.forEach((section) => {

                    contents_page += section.order + ". " + section.name + "\n"

                    section.subsections.forEach((subsection) => {
                        if (subsection.name !== "front"){

                            contents_page += "      "+section.order + "." +subsection.sectionsubsections.order+ ". "+subsection.name + "\n"
                        }
                        subsection_count++      
                    })
                })

                let delay_i = i;
                report.sections.forEach( async(section) => {

                    // setTimeout(() => {

                    if(section.subsections){
                        section.subsections.forEach( async(subsection) => {                       

                            // setTimeout(() => {

                            //GET SUBSECTION
                            //GET PARAMETER SUBSECTIONS
                            //PULL OUT ANY PARAMETERS SAID SUBSECTION NEEDS FROM OVERALL PARAMETER OBJECT
                            let subsection_param_object = {}
                            if (subsection.parameters){
                                subsection.parameters.forEach( async(parameter) => {
                                    subsection_param_object[parameter.name] = parameter_object[parameter.name];
                                })
                            }

                            if(subsection.name === "front"){
                                subsection_param_object['contents_page'] = contents_page;
                            }

                            filepath = subsection.path;
                            filename = subsection.name;  
                            let size = 10
                            
                            let file_number = (section.order * 1000) + subsection.sectionsubsections.order

                            outputname = "000000000" + file_number;
                            outputname = outputname.substr(outputname.length-size);
        
                            let output_file = path.join(folder_path,outputname);                
                            
                            // console.log("timer set to: "+((subsection_count * i)+delay_i))

                            exports.runDelay((subsection_count * i)+delay_i, filepath, filename, subsection_param_object, folder_path, output_file)
                            // exports.runReport(filepath, filename, subsection_param_object, folder_path, output_file)
                            delay_i++
                            // console.log(subsection_i)

                            // }, subsection_i * 5000);

                        })
                    }

                    // }, subsection_i * 5000);

                })
            }

        }

    }
    catch(err){
        console.log(err)
    }

}

//RUN THE REPORT SECTION BUT ONLY AFTER A GIVEN DELAY
exports.runDelay = async(i, filepath, filename, parameters, output_path, output_file) => {
    
    await functionsUtil.delay(3000 * i)
    exports.runReport(filepath, filename, parameters, output_path, output_file)
}

exports.runReport = async(filepath, filename, parameters, output_path, output_file) => {
    
    const reportPath = filepath + filename;
    try {
        // console.log("running: "+filename)
        
        // Define parameters
        const fileType = 'WORD';
        const file_extension = 'docx';
        
        let report;
        
        exports.ssrs.setServerUrl(serverUrl);
        
        var auth = {
            userName: username,
            password: password,
            workstation: null, // optional
            domain: null // optional
          };
        // This part errors on the server
        console.log("running report... "+reportPath)
        report = await exports.ssrs.reportExecution.getReportByUrl(reportPath, fileType, parameters, auth)        

        
        // Writing to local file / or send the reponse to API 
        await fs.writeFileSync(output_file+'.'+file_extension, report, "base64");
        exports.checkFiles(output_path)
        /**/
    } catch (err) {
        console.log("ERROR RUNNING REPORT")

        exports.checkFiles(output_path, reportPath, err)
    }
}

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
                subscription_activity.files_current++
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

            //IF THE FILE COUNT IS EQUAL TO FILES EXPECTED
            if (subscription_activity.files_current === subscription_activity.files_expected){

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
                    //IF THERE AREN'T ANY ERRORS, MERGE THE DOCUMENT, SAVE IT ONTO STORAGE THEN EMAIL IT OUT
                    if(subscription_activity.errors === 0){
                        //MERGE REPORT AND SEND
                        await mergeDocumentUtil.mergeDocument(output_path)

                        await emailUtil.email(subscription, "output.docx",path.join(output_path,"output.docx"))

                        //DELETE FILES AND TEMPORARY FOLDER
                        exports.deleteTemp(output_path)
                    }
                    //ELSE EMAIL THE ERROR TO THE USER
                    else{
                        subscription.subject = 'Error Running Subscription: ' + subscription.name;
                        subscription.body = subscription_activity.log                        
                        await emailUtil.email(subscription)

                        //DELETE FILES AND TEMPORARY FOLDER                    
                        exports.deleteTemp(output_path)
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

    }
    catch (err) {
        console.log("ERROR UPDATING SUBSCRIPTION ACTIVITY")
        console.log(err)

        exports.checkFiles(output_path, reportPath, err)
    }    
}

exports.deleteTemp = (output_path) => {

    if(output_path.includes('tmp')){
        console.log("Deleting temp folder: "+output_path)
        fs.rmdirSync(output_path, { recursive: true });
    }

}




