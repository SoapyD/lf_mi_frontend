const emailUtil = require('../util/email');
const databaseQueriesUtil = require('../util/database_queries2');
const mergeDocumentUtil = require('../util/merge_document');

var fs = require('fs');
var path = require('path');
const tmp = require('tmp');



exports.ssrs = require('mssql-ssrs');
// exports.files = [];


const username = process.env.SSRS_USER;
const password = process.env.SSRS_PASS;
var serverUrl = process.env.SSRS_URL; ///ReportServer2010


exports.run = async(report, subscription) => {

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
                        files_expected: file_data.files_needed
                    }
                ]
            }) 
    
            let subscriptionactivities = await databaseQueriesUtil.createData2(creation_list)	            


            let filepath = '';
            let filename = '';
            let outputname = '';
            let parameter_object = JSON.parse(subscription.parameters);
            let contents_page = '-';

            //CREATE THE CONTENT PAGE TEXT
            if(report.sections){
                report.sections.forEach((section) => {

                    if(section.subsections){
                        section.subsections.forEach((subsection) => {
                            if (subsection.name !== "front"){
                                contents_page += subsection.name + "\n"
                            }                            

                            //GET SUBSECTION
                            //GET PARAMETER SUBSECTIONS
                            //PULL OUT ANY PARAMETERS SAID SUBSECTION NEEDS FROM OVERALL PARAMETER OBJECT
                            let subsection_param_object = {}
                            if (subsection.parameters){
                                subsection.parameters.forEach((parameter) => {
                                    subsection_param_object[parameter.name] = parameter_object[parameter.name];
                                })
                            }


                            filepath = subsection.path;
                            filename = subsection.name;  
                            let size = 3
                            
                            let file_number = (section.order * 1000) + subsection.sectionsubsections.order

                            outputname = "000000000" + file_number;
                            outputname = outputname.substr(outputname.length-size);
        
                            let output_file = path.join(folder_path,outputname);                
                            
                            exports.runReport(filepath, filename, subsection_param_object, folder_path, output_file)

                        })
                    }

                })
            }

        }

    }
    catch(err){
        console.log(err)
    }

}

exports.runReport = async(filepath, filename, parameters, output_path, output_file) => {
    
    try {
        console.log("running: "+filename)
        const reportPath = filepath + filename;
        
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
        console.log("getting report... "+reportPath)
        report = await exports.ssrs.reportExecution.getReportByUrl(reportPath, fileType, parameters, auth)        

        
        // Writing to local file / or send the reponse to API 
        await fs.writeFileSync(output_file+'.'+file_extension, report, "base64");
        exports.checkFiles(output_path)
        /**/
    } catch (err) {
        console.log("ERROR RUNNING REPORT")

        exports.checkFiles(output_path, err)
    }
}

//ADD THE FILE TO THE SUBSCRIPTION ACTIVITY AND CHECK IF IT'S THEN COMPLETE
exports.checkFiles = (output_path, err) => {

    //RETUNR THE SUBSCRIPTION ACTIVITY ENTRY
    databaseQueriesUtil.getSubscriptionActivity(-1, output_path)
    .then((subscription_activity) => {
        
        //UPDATE THE ERROR VALUE AND MESSAGES IF THERE ARE ANY, ELSE JUST INCREASE FILE COUNT
        if (err){
            subscription_activity.files_current++
            subscription_activity.errors++
            try {
                subscription_activity.log += err.body.toString() + '\n'
            } catch (err) {
                //error
            }
        }
        else{
            subscription_activity.files_current++
        }

        //SAVE ACTIVITY DATA
        subscription_activity.save()
        .then((subscription_activity) => {

            //IF THE FILE COUNT IS EQUAL TO FILES EXPECTED
            if (subscription_activity.files_current === subscription_activity.files_expected){

                //GET THE SUBSCRIPTION
                databaseQueriesUtil.getSubscription(subscription_activity.subscription_id)
                .then(async(subscription) =>{

                    //IF THERE AREN'T ANY ERRORS, MERGE THE DOCUMENT, SAVE IT ONTO STORAGE THEN EMAIL IT OUT
                    if(subscription_activity.errors === 0){
                        //MERGE REPORT AND SEND
                        // await exports.mergeDocument(item.folder_path, file_list, Date.now() )
                        await mergeDocumentUtil.mergeDocument(output_path)

                        emailUtil.email(subscription, "output.docx",path.join(output_path,"output.docx"))
                    }
                    //ELSE EMAIL THE ERROR TO THE USER
                    else{
                        subscription.subject = 'Error Running Subscription: ' + subscription.name;
                        subscription.body = subscription_activity.log                        
                        emailUtil.email(subscription)
                    }
                    
                    //SET THE SUBSCRIPTION TO NO LONGER RUNNING
                    subscription_activity.running = 0;
                    subscription_activity.save()

                })
            }

        })
    })
}






