const emailUtil = require('../util/email');
const databaseQueriesUtil = require('../util/database_queries');
const mergeDocumentUtil = require('../util/merge_document');

var fs = require('fs');
var path = require('path');
const tmp = require('tmp');



exports.ssrs = require('mssql-ssrs');
// exports.files = [];


const username = process.env.SSRS_USER;
const password = process.env.SSRS_PASS;
var serverUrl = process.env.SSRS_URL; ///ReportServer2010


exports.run = async(subscriptions, report, fusions, subsections, parameter_fusions, parameters) => {

    try{

        subscriptions.forEach((subscription)=>{ //LOOP THROUGH EACH PERSCRIPTION
            
            if (subscription.active === true){

                const tmpobj = tmp.dirSync();
            
                let folder_path = tmpobj.name //'reports';//
                
                let file_data = {
                    folder_path: folder_path,
                    files_needed: fusions.length
                }
                
                databaseQueriesUtil.createSubscriptionActivity(subscription, file_data)
                .then((subscription_activity) => {
                    // exports.files.push(file_data);
                    
                    let filepath = '';
                    let filename = '';
                    let outputname = '';
                    
                    let contents_page = '-';
                    //make a contents page
                    fusions.forEach(function (fusion){
                        //get subsection data associated with fusion
                        var subsection = subsections.find(o => o.id === fusion.join_from_id);
                        
                        if (subsection.name !== "front"){
                            contents_page += subsection.name + "\n"
                        }
                    })
                    
                    //CONVERT PARAMETER STRING INTO AN OBJECT
                    let parameter_object = JSON.parse(subscription.parameters);
                    
                    fusions.forEach((fusion) => { //LOOP THROUGH Sub SECTION/REPORT FUSIONS
                        let subsection = subsections.find(o => o.id === fusion.join_from_id); //GET SUB SECTION DATA FROM FUSION
                        //GET PARAMETERS ASSOCIATED WITH SUB SECTION
                        let p_fusions_t = parameter_fusions.filter(o => o.join_to_id === fusion.join_from_id);
                        let p_fusions;
                        //IF P_FUSIONS_T ISN'T AN ARRAY, OR UNDEFINED, MAKE IT AN ARRAY
                        if (Array.isArray(p_fusions_t) === false){
                            if(p_fusions_t){
                                p_fusions = [];
                                p_fusions.push(p_fusions_t)
                            }
                        }else{
                            p_fusions = p_fusions_t
                        }
                        
                        let param_string = "{"
                        //LOOP P_FUSIONS IF IT'S DEFINED
                        if (p_fusions){
                            p_fusions.forEach((p_fusion, index) => {
                                let parameter = parameters.find(o => o.id === p_fusion.join_from_id);
                                let value = parameter_object[parameter.name];
                                
                                if(index > 0){
                                    param_string+= " , "
                                }
                                param_string += '"' + parameter.name + '" : "'+value+'"'
                            })
                        }
                        
                        param_string += "}"
                        let subsection_param_object = JSON.parse(param_string)
                        
                        if(subsection.name === "front"){
                            subsection_param_object['contents_page'] = contents_page;
                        }
                        
                        filepath = subsection.path;
                        filename = subsection.name;  
                        let size = 3
                        
                        outputname = "000000000" + fusion.order;
                        outputname = outputname.substr(outputname.length-size);
    
                        let output_file = path.join(folder_path,outputname);                
                        
                        exports.runReport(filepath, filename, subsection_param_object, folder_path, output_file)
                    })
                })    

            }

        })
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






