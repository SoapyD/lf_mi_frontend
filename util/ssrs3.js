// const emailUtil = require('../util/email');
// const mergeDocumentUtil = require('../util/merge_document');
const databaseQueriesUtil = require('../util/database_queries2');
const checkOutputsUtil = require('../util/check_output_files');
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
                        files_expected: file_data.files_needed + 1,
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

                //ADD FRONT PAGE
                filepath = "/99 - Test Reports/Tom Dev/Service Report/"
                filename = 'front'
                subsection_param_object = 
                {
                    "report_name":"TEST REPORT", 
                    "company_filter": "test org",
                    "contents_page": contents_page
                }
                outputname = "000000000"
                let output_file = path.join(folder_path,outputname);
                exports.runDelay(0, filepath, filename, subsection_param_object, folder_path, output_file)


                //LOOP THROUGH EACH SECTION AND RUN THE SUBSECTIONS
                let delay_i = i;
                report.sections.forEach( async(section) => {

                    // setTimeout(() => {

                    if(section.subsections){
                        section.subsections.forEach( async(subsection, n) => {                       

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


                            //SET THE SECTION AND SUBSECTION NAMES
                            subsection_param_object['Section_Name'] = ''
                            if(n === 0){
                                subsection_param_object['Section_Name'] = section.order + ". " + section.name;
                            }
                            subsection_param_object['Subsection_Name'] = section.order + "." + subsection.sectionsubsections.order+ ". "+subsection.name;
                            subsection_param_object['Add_Analysis_Box'] = "Y"

                            // if(subsection.name === "front"){
                            //     subsection_param_object['contents_page'] = contents_page;
                            // }

                            filepath = subsection.path;
                            filename = subsection.name;  
                            let size = 10
                            
                            let file_number = (section.order * 1000) + subsection.sectionsubsections.order

                            outputname = "000000000" + file_number;
                            outputname = outputname.substr(outputname.length-size);
        
                            output_file = path.join(folder_path,outputname);                
                            
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
        checkOutputsUtil.checkFiles(output_path)
        /**/
    } catch (err) {
        console.log("ERROR RUNNING REPORT")

        checkOutputsUtil.checkFiles(output_path, reportPath, err)
    }
}






