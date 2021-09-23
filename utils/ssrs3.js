// const emailUtil = require('../util/email');
// const mergeDocumentUtil = require('../utils/merge_document');
const databaseQueriesUtil = require('../utils/database_queries2');
const checkOutputsUtil = require('../utils/check_output_files');
const functionsUtil = require('../utils/functions');

var fs = require('fs');
var path = require('path');
const tmp = require('tmp');
// const Subscription = require('../models/subscription');



exports.ssrs = require('mssql-ssrs');
// exports.files = [];


const username = process.env.SSRS_USER;
const password = process.env.SSRS_PASS;
var serverUrl = process.env.SSRS_URL; ///ReportServer2010



exports.run = async(subscription_number, report, subscription) => {

    try{

        if (subscription.active === true){

            const tmpobj = tmp.dirSync();
        
            let folder_path = tmpobj.name //'reports';//

            
            let subsection_count = 1; //1 for front cover
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
            

            let filepath = '';
            let filename = '';
            let outputname = '';
            let parameter_object = JSON.parse(subscription.parameters);
            let contents_page = '';

            //CREATE THE CONTENT PAGE TEXT
            if(report.sections){

                let subsection_total = 0

                //FORMAT THE CONTENTS PAGE
                report.sections.forEach((section) => {

                    contents_page += section.order + ". " + section.name + "\n"

                    section.subsections.forEach((subsection) => {
                        if (subsection.name !== "front" && subsection.type !== 'appendix'){

                            let subsection_name = subsection.name
                            if(subsection.sectionsubsections.name && subsection.sectionsubsections.name !== ""){
                                subsection_name = subsection.sectionsubsections.name
                            }

                            contents_page += "      "+section.order + "." +subsection.sectionsubsections.order+ ". "+subsection_name + "\n"
                        }
                        subsection_total++      
                    })
                })
            }


            let creation_list = []
            creation_list.push(
            {
                model: "SubscriptionActivity",
                params: [
                    {
                        path: folder_path,
                        files_expected: file_data.files_needed,
                        subscriptionId: subscription.id,
                        contents_page: contents_page
                    }
                ]
            }) 
    
            let subscriptionactivities = await databaseQueriesUtil.createData2(creation_list)	            



            //CREATE THE CONTENT PAGE TEXT
            if(report.sections){

                let subsection_total = 0


                //ADD FRONT PAGE
                filepath = "/99 - Test Reports/Service Report/_Front Cover"
                subsection_param_object = 
                {
                    // "report_name":report.name, 
                    // "company_filter": parameter_object.Client,
                    "report_name":report.name, 
                    "company_filter": subscription.name,                    
                    "sub_activity_id": subscriptionactivities[0].id,
                    "period_type": parameter_object.Date_Range
                }
                outputname = "0000000000"
                let output_file = path.join(folder_path,outputname);
                exports.runDelay(((subsection_total*4) * subscription_number), filepath, subsection_param_object, folder_path, output_file)


                //START THE DELAY VALUE AS THE SUBSCRIPTION NUMBER
                let subsection_count = 0;
                
                //LOOP THROUGH EACH SECTION AND RUN THE SUBSECTIONS
                report.sections.forEach( async(section) => {

                    // setTimeout(() => {

                    if(section.subsections){
                        section.subsections.forEach( async(subsection, subsection_number) => {                       

                            // setTimeout(() => {

                            //GET SUBSECTION
                            //GET PARAMETER SUBSECTIONS
                            //PULL OUT ANY PARAMETERS SAID SUBSECTION NEEDS FROM OVERALL PARAMETER OBJECT
                            let subsection_param_object = {}
                            let report_param_object = {}
                            if (subsection.parameters){
                                subsection.parameters.forEach( async(parameter) => {
                                    if(parameter_object[parameter.name] && parameter_object[parameter.name] !== ""){
                                        if(parameter.in_report === false || parameter.visible === false){
                                            report_param_object[parameter.name] = parameter_object[parameter.name];
                                        }
                                        else{
                                            subsection_param_object[parameter.name] = parameter_object[parameter.name];
                                        }
     
                                    }
                                })
                            }


                            let delay_timer_value = (((subsection_total*1) * subscription_number) + (subsection_count*1)) + 1 //+1 for front cover
                            let size = 10
                            let file_number = (section.order * 1000) + delay_timer_value // + subsection.sectionsubsections.order


                            //SET THE SECTION AND SUBSECTION NAMES
                            report_param_object['Section_Name'] = ''
                            if(subsection_number === 0){
                                report_param_object['Section_Name'] = section.order + ". " + section.name;
                            }
                            let subsection_name = subsection.name
                            if(subsection.sectionsubsections.name && subsection.sectionsubsections.name !== ""){
                                subsection_name = subsection.sectionsubsections.name
                            }
                            
                            report_param_object['Subsection_Name'] = section.order + "." + subsection.sectionsubsections.order+ ". "+subsection_name;
                            // report_param_object['Add_Analysis_Box'] = "Y"
                            report_param_object['Hide_Analysis'] = "false"


                            if(subsection_number === 0){
                                subsection_param_object.Section_Name = report_param_object['Section_Name']
                            }

                            switch(subsection.type){
                                case "template":
                                case "appendix template":
                                    subsection_param_object.Subsection_Name = report_param_object['Subsection_Name']

                                    if(process.env.MERGE_METHOD == 'DOCX-MERGER'){
                                        subsection_param_object.Hide_PageBreak = "false"  
                                    }
                                break;
                                case "normal":
                                    subsection_param_object.Subsection_Name = report_param_object['Subsection_Name']
                                    ,subsection_param_object.Hide_Analysis = "false"
                                    if(process.env.MERGE_METHOD == 'DOCX-MERGER'){
                                        subsection_param_object.Hide_PageBreak = "false"  
                                    }                                    
                                break;  
                                case "appendix":
                                    if(process.env.MERGE_METHOD == 'DOCX-MERGER'){
                                        subsection_param_object.Hide_PageBreak = "false"  
                                    }
                                break;                                                                
                                default:

                            }
                            
                            //ADD SUBSECTION
                            outputname = "000000000" + file_number;
                            outputname = outputname.substr(outputname.length-size);
        
                            output_file = path.join(folder_path,outputname); 


                            exports.runDelay(delay_timer_value, subsection.path, subsection_param_object, folder_path, output_file)

                            // if(report_param_object.database === "snapshot"){
                            //     exports.runDelay(delay_timer_value, subsection.path_snapshot, subsection_param_object, folder_path, output_file)
                            // }
                            // if(report_param_object.database === "warehouse"){
                            //     exports.runDelay(delay_timer_value, subsection.path_warehouse, subsection_param_object, folder_path, output_file)
                            // }


                            subsection_count++

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

let count = 1

//RUN THE REPORT SECTION BUT ONLY AFTER A GIVEN DELAY
exports.runDelay = async(i, filepath, parameters, output_path, output_file) => {
    

    // console.log(i + ' ||| ' + output_file + ' ||| ' + filepath + ' ||| ' + count)
    // count++

    await functionsUtil.delay(3000 * i)
    exports.runReport(filepath, parameters, output_path, output_file)
}

exports.runReport = async(filepath, parameters, output_path, output_file) => {
    
    const reportPath = filepath;
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
        console.log("output file:",output_file, " ||| running report... ",reportPath)
        report = await exports.ssrs.reportExecution.getReportByUrl(reportPath, fileType, parameters, auth)        

        
        // Writing to local file / or send the reponse to API 
        await fs.writeFileSync(output_file+'.'+file_extension, report, "base64");
        checkOutputsUtil.checkFiles(output_path)
        /**/

    } catch (err) {
        console.log("ERROR RUNNING REPORT")

        checkOutputsUtil.checkFiles(output_path, reportPath, err)
    }
}





