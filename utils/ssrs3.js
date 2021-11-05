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



//  #####  ####### ####### #     # ######  
// #     # #          #    #     # #     # 
// #       #          #    #     # #     # 
//  #####  #####      #    #     # ######  
//       # #          #    #     # #       
// #     # #          #    #     # #       
//  #####  #######    #     #####  #   

exports.setup = async(subscription_number, report, subscription) => {

    try{

        if (subscription.active === true){

            const tmpobj = tmp.dirSync(); //CREATE A TEMP FOLDER TO STORE THE FILES
        
            let folder_path = tmpobj.name //GET THE FOLDER PATH

            
            //COUNT THE TOTAL NUMBER OF SUBSECTIONS NEEDED
            let subsection_total = 1; //1 for front cover
            if(report.sections){
                report.sections.forEach((section) => {

                    if(section.subsections){

                        subsection_total += section.subsections.length
                    }
                })
            }

            //STORE THIS DATA IN AN OBJECT
            let file_data = {
                folder_path: folder_path,
                files_needed: subsection_total
            }
            

            let outputname = '';
            let delay_timer = 0
            let parameter_object = JSON.parse(subscription.parameters);
            let size = 10
            let start = Date.now();

            //  ██████  ██████  ███    ██ ████████ ███████ ███    ██ ████████ ███████       ███████ ████████ ██████  ██ ███    ██  ██████  
            // ██      ██    ██ ████   ██    ██    ██      ████   ██    ██    ██            ██         ██    ██   ██ ██ ████   ██ ██       
            // ██      ██    ██ ██ ██  ██    ██    █████   ██ ██  ██    ██    ███████ █████ ███████    ██    ██████  ██ ██ ██  ██ ██   ███ 
            // ██      ██    ██ ██  ██ ██    ██    ██      ██  ██ ██    ██         ██            ██    ██    ██   ██ ██ ██  ██ ██ ██    ██ 
            //  ██████  ██████  ██   ████    ██    ███████ ██   ████    ██    ███████       ███████    ██    ██   ██ ██ ██   ████  ██████              

            let contents_page = '';
            let subsection_activity = {};

            //CREATE THE CONTENT PAGE TEXT
            if(report.sections){

                let subsection_count = 0;

                // let subsection_total = 0

                // ███████ ██████   ██████  ███    ██ ████████        ██████  ██████  ██    ██ ███████ ██████  
                // ██      ██   ██ ██    ██ ████   ██    ██          ██      ██    ██ ██    ██ ██      ██   ██ 
                // █████   ██████  ██    ██ ██ ██  ██    ██    █████ ██      ██    ██ ██    ██ █████   ██████  
                // ██      ██   ██ ██    ██ ██  ██ ██    ██          ██      ██    ██  ██  ██  ██      ██   ██ 
                // ██      ██   ██  ██████  ██   ████    ██           ██████  ██████    ████   ███████ ██   ██                 
                //ADD THE FRONT COVER TO SUBSECTION ACTIVITIES
                outputname = "000000000" + subsection_count;
                outputname = outputname.substr(outputname.length-size);
                delay_timer = 3000 * ((file_data.files_needed * subscription_number) + subsection_count);

                let activity = {
                    name: outputname,
                    number: subsection_count,
                    running: true,
                    tries: 10,
                    path: "/99 - Test Reports/Service Report/_Front Cover",
                    output_path: path.join(folder_path,outputname),
                    parameters:                 
                    {
                        "report_name":subscription.report_name, 
                        "company_filter": subscription.report_sub_name,
                        "period_type": parameter_object.Date_Range
                    },
                    error: null,
                    delay_timer: delay_timer,
                    start: start + delay_timer,
                    last_updated: start + delay_timer
                }
                subsection_activity[outputname] = activity;



                // ██████  ██    ██ ███    ██       ███████ ███████  ██████ ████████ ██  ██████  ███    ██ ███████ 
                // ██   ██ ██    ██ ████   ██       ██      ██      ██         ██    ██ ██    ██ ████   ██ ██      
                // ██████  ██    ██ ██ ██  ██ █████ ███████ █████   ██         ██    ██ ██    ██ ██ ██  ██ ███████ 
                // ██   ██ ██    ██ ██  ██ ██            ██ ██      ██         ██    ██ ██    ██ ██  ██ ██      ██ 
                // ██   ██  ██████  ██   ████       ███████ ███████  ██████    ██    ██  ██████  ██   ████ ███████ 

                report.sections.forEach((section) => {

                    contents_page += section.order + ". " + section.name + "\n"

                    section.subsections.forEach((subsection, subsection_number) => {
                        if (subsection.name !== "front" && subsection.type !== 'appendix'){

                            let subsection_name = subsection.name
                            if(subsection.sectionsubsections.name && subsection.sectionsubsections.name !== ""){
                                subsection_name = subsection.sectionsubsections.name
                            }

                            contents_page += "      "+section.order + "." +subsection.sectionsubsections.order+ ". "+subsection_name + "\n"
                        }

                        subsection_count++      


                        // ███████ ██    ██ ██████  ███████ ███████  ██████ ████████ ██  ██████  ███    ██       ██████   █████  ██████   █████  ███    ███ ███████ 
                        // ██      ██    ██ ██   ██ ██      ██      ██         ██    ██ ██    ██ ████   ██       ██   ██ ██   ██ ██   ██ ██   ██ ████  ████ ██      
                        // ███████ ██    ██ ██████  ███████ █████   ██         ██    ██ ██    ██ ██ ██  ██ █████ ██████  ███████ ██████  ███████ ██ ████ ██ ███████ 
                        //      ██ ██    ██ ██   ██      ██ ██      ██         ██    ██ ██    ██ ██  ██ ██       ██      ██   ██ ██   ██ ██   ██ ██  ██  ██      ██ 
                        // ███████  ██████  ██████  ███████ ███████  ██████    ██    ██  ██████  ██   ████       ██      ██   ██ ██   ██ ██   ██ ██      ██ ███████                         
                        //ADD THE INDIVIDUAL SEUBSECTION ACTIVITY
                        
                        let options = {
                            section: section,
                            subsection: subsection,
                            subsection_total: subsection_total, //TOTAL SUBSECTIONS IN ENTIRE REPORT
                            subsection_count: subsection_count, //CURRENT TOTAL SUBSECTION COUNT
                            subsection_number: subsection_number, //CURRENT SUBSECTION COUNT, RESET PER SECTION
                            subscription_number: subscription_number,
                            parameter_object: parameter_object,
                        }
                        let subsection_parameters = exports.getSubsectionParameters(options)

                        outputname = "000000000" + subsection_count;
                        outputname = outputname.substr(outputname.length-size);
                        delay_timer = 3000 * ((file_data.files_needed * subscription_number) + subsection_count);
                        let test = start + delay_timer

                        let activity = {
                            name: outputname,
                            number: subsection_count,
                            running: true,
                            tries: 10,
                            path: subsection.path,
                            output_path: path.join(folder_path,outputname),
                            parameters: subsection_parameters,
                            error: null,
                            delay_timer: delay_timer,
                            start: start + delay_timer,
                            last_updated: start + delay_timer
                        }
                        subsection_activity[outputname] = activity;
                    })
                })
            }

            //  #####  ######  #######    #    ####### #######          #     #####  ####### ### #     # ### ####### #     # 
            // #     # #     # #         # #      #    #               # #   #     #    #     #  #     #  #     #     #   #  
            // #       #     # #        #   #     #    #              #   #  #          #     #  #     #  #     #      # #   
            // #       ######  #####   #     #    #    #####   ##### #     # #          #     #  #     #  #     #       #    
            // #       #   #   #       #######    #    #             ####### #          #     #   #   #   #     #       #    
            // #     # #    #  #       #     #    #    #             #     # #     #    #     #    # #    #     #       #    
            //  #####  #     # ####### #     #    #    #######       #     #  #####     #    ###    #    ###    #       #               

            let creation_list = []
            creation_list.push(
            {
                model: "SubscriptionActivity",
                params: [
                    {
                        file_type: "WORD",
                        file_extension: "docx",                        
                        path: folder_path,
                        files_expected: file_data.files_needed,
                        subscriptionId: subscription.id,
                        contents_page: contents_page,
                        subsection_activity: JSON.stringify(subsection_activity)
                    }
                ]
            }) 
    
            let subscriptionactivities = await databaseQueriesUtil.createData2(creation_list)	            

            exports.runProcess(subscriptionactivities[0]) 
        }

    }
    catch(err){
        console.log(err)
    }

}

// ███████ ██    ██ ██████  ███████ ███████  ██████ ████████ ██  ██████  ███    ██       ██████   █████  ██████   █████  ███    ███ ███████ 
// ██      ██    ██ ██   ██ ██      ██      ██         ██    ██ ██    ██ ████   ██       ██   ██ ██   ██ ██   ██ ██   ██ ████  ████ ██      
// ███████ ██    ██ ██████  ███████ █████   ██         ██    ██ ██    ██ ██ ██  ██ █████ ██████  ███████ ██████  ███████ ██ ████ ██ ███████ 
//      ██ ██    ██ ██   ██      ██ ██      ██         ██    ██ ██    ██ ██  ██ ██       ██      ██   ██ ██   ██ ██   ██ ██  ██  ██      ██ 
// ███████  ██████  ██████  ███████ ███████  ██████    ██    ██  ██████  ██   ████       ██      ██   ██ ██   ██ ██   ██ ██      ██ ███████ 

exports.getSubsectionParameters = (options) => {
    
    // LOOP THROUGH SUBSECTION PARAMETERS AND SPLIT THEM OUT INTO TWO DISTINCT LISTS; REPORT AND SUBSECTION PARAMETERS
    let subsection_param_object = {}
    let report_param_object = {}

    if (options.subsection.parameters){
        options.subsection.parameters.forEach( async(parameter) => {
            if(options.parameter_object[parameter.name] && options.parameter_object[parameter.name] !== ""){
                if(parameter.in_report === false || parameter.visible === false){
                    report_param_object[parameter.name] = options.parameter_object[parameter.name];
                }
                else{
                    subsection_param_object[parameter.name] = options.parameter_object[parameter.name];
                }
            }
        })
    }


    let delay_timer_value = (((options.subsection_total*1) * options.subscription_number) + (options.subsection_count*1)) + 1 //+1 for front cover
    let file_number = (options.section.order * 1000) + delay_timer_value // + subsection.sectionsubsections.order


    //SET THE SECTION AND SUBSECTION NAMES
    report_param_object['Section_Name'] = ''
    if(options.subsection_number === 0){
        report_param_object['Section_Name'] = options.section.order + ". " + options.section.name;
    }
    let subsection_name = options.subsection.name
    if(options.subsection.sectionsubsections.name && options.subsection.sectionsubsections.name !== ""){
        subsection_name = options.subsection.sectionsubsections.name
    }
    
    report_param_object['Subsection_Name'] = options.section.order + "." + options.subsection.sectionsubsections.order+ ". "+subsection_name;


    //ANALYSIS & PAGE BREAKS

    report_param_object['Hide_Analysis'] = "false"
    if(options.subsection.sectionsubsections.show_analysis_box === false){
        report_param_object['Hide_Analysis'] = "true"
    }


    if(options.subsection_number === 0){
        subsection_param_object.Section_Name = report_param_object['Section_Name']
    }

    switch(options.subsection.type){
        case "template":
        case "appendix template":
            subsection_param_object.Subsection_Name = report_param_object['Subsection_Name']

            if(process.env.MERGE_METHOD == 'DOCX-MERGER'){
                subsection_param_object.Hide_PageBreak = "false"  
            }
        break;
        case "normal":
            subsection_param_object.Subsection_Name = report_param_object['Subsection_Name']
            ,subsection_param_object.Hide_Analysis = report_param_object['Hide_Analysis']
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

    return subsection_param_object;
}


// ######  #     # #     #       ######  ######  #######  #####  #######  #####   #####  
// #     # #     # ##    #       #     # #     # #     # #     # #       #     # #     # 
// #     # #     # # #   #       #     # #     # #     # #       #       #       #       
// ######  #     # #  #  # ##### ######  ######  #     # #       #####    #####   #####  
// #   #   #     # #   # #       #       #   #   #     # #       #             #       # 
// #    #  #     # #    ##       #       #    #  #     # #     # #       #     # #     # 
// #     #  #####  #     #       #       #     # #######  #####  #######  #####   #####  

exports.runProcess = (subscriptionactivity) => {

    let subsections = JSON.parse(subscriptionactivity.subsection_activity)


    for(const key in subsections){
        let subsection = subsections[key];

        //ADD IN SUBSCRIPTION ID IF THIS IS THE FRONT COVER SO THE CONTENTS PAGE CAN BE RETURNED
        if(subsection.number === 0){
            subsection.parameters.sub_activity_id = subscriptionactivity.id
        }

        // let delay_timer_value = ((subscriptionactivity.files_expected * subscription_number) + subsection.number) + 1 //+1 for front cover

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

        exports.runDelay(options)
    }
}



// ██████  ██    ██ ███    ██       ███████ ███████ ██████  ███████ 
// ██   ██ ██    ██ ████   ██       ██      ██      ██   ██ ██      
// ██████  ██    ██ ██ ██  ██ █████ ███████ ███████ ██████  ███████ 
// ██   ██ ██    ██ ██  ██ ██            ██      ██ ██   ██      ██ 
// ██   ██  ██████  ██   ████       ███████ ███████ ██   ██ ███████ 


let count = 1

//RUN THE REPORT SECTION BUT ONLY AFTER A GIVEN DELAY
exports.runDelay = async(options) => {

    await functionsUtil.delay(options.delay_timer)
    exports.runReport(options)
}


exports.runReport = async(options) => {
    
    const reportPath = options.filepath;
    try {

        let report;
        
        exports.ssrs.setServerUrl(serverUrl);
        
        var auth = {
            userName: username,
            password: password,
            workstation: null, // optional
            domain: null // optional
          };
        // This part errors on the server
        console.log("output file:",options.output_file, " ||| running report... ",reportPath)
        report = await exports.ssrs.reportExecution.getReportByUrl(reportPath, options.file_type, options.parameters, auth)        

        
        // Writing to local file / or send the reponse to API 
        await fs.writeFileSync(options.output_file+'.'+options.file_extension, report, "base64");
        // checkOutputsUtil.checkFiles(output_path)
        /**/

    } catch (err) {
        console.log("ERROR RUNNING REPORT")
        // checkOutputsUtil.checkFiles(output_path, reportPath, err)

        let find_list = []
        find_list.push(
        {
            model: "SubscriptionActivity",
            search_type: "findOne",
            params: [{
                where: {
                    id: options.activity_id,
                }		
            }]
        }) 
    
        //GET ALL REPORT DATA
        let subscriptionactivities = await databaseQueriesUtil.findData(find_list)
        let subscriptionactivity = subscriptionactivities[0];
        let subsection_activity = JSON.parse(subscriptionactivity.subsection_activity)

        // subsection_activity[options.name].running = false;
        // subsection_activity[options.name].tries = 0;
        if(err){
            subsection_activity[options.name].error = err;
        }else{
            subsection_activity[options.name].error = "undefined error";            
        }

        subscriptionactivity.subsection_activity = JSON.stringify(subsection_activity)
        subscriptionactivity.save();
    }
}





            /*
            //CREATE THE CONTENT PAGE TEXT
            if(report.sections){

                let subsection_total = 0

                // ███████ ██████   ██████  ███    ██ ████████        ██████  ██████  ██    ██ ███████ ██████  
                // ██      ██   ██ ██    ██ ████   ██    ██          ██      ██    ██ ██    ██ ██      ██   ██ 
                // █████   ██████  ██    ██ ██ ██  ██    ██    █████ ██      ██    ██ ██    ██ █████   ██████  
                // ██      ██   ██ ██    ██ ██  ██ ██    ██          ██      ██    ██  ██  ██  ██      ██   ██ 
                // ██      ██   ██  ██████  ██   ████    ██           ██████  ██████    ████   ███████ ██   ██ 


                //ADD FRONT PAGE
                filepath = "/99 - Test Reports/Service Report/_Front Cover"
                subsection_param_object = 
                {
                    "report_name":subscription.report_name, 
                    "company_filter": subscription.report_sub_name,                    
                    "sub_activity_id": subscriptionactivities[0].id,
                    "period_type": parameter_object.Date_Range
                }
                outputname = "0000000000"
                let output_file = path.join(folder_path,outputname);
                exports.runDelay(((subsection_total*4) * subscription_number), filepath, subsection_param_object, folder_path, output_file)




                // ██████  ██    ██ ███    ██       ███████ ███████  ██████ ████████ ██  ██████  ███    ██ ███████ 
                // ██   ██ ██    ██ ████   ██       ██      ██      ██         ██    ██ ██    ██ ████   ██ ██      
                // ██████  ██    ██ ██ ██  ██ █████ ███████ █████   ██         ██    ██ ██    ██ ██ ██  ██ ███████ 
                // ██   ██ ██    ██ ██  ██ ██            ██ ██      ██         ██    ██ ██    ██ ██  ██ ██      ██ 
                // ██   ██  ██████  ██   ████       ███████ ███████  ██████    ██    ██  ██████  ██   ████ ███████ 


                //START THE DELAY VALUE AS THE SUBSCRIPTION NUMBER
                let subsection_count = 0;
                
                //LOOP THROUGH EACH SECTION AND RUN THE SUBSECTIONS
                report.sections.forEach( async(section) => {

                    // setTimeout(() => {

                    if(section.subsections){
                        section.subsections.forEach( async(subsection, subsection_number) => {                       

                            // setTimeout(() => {

                                // ███████ ██    ██ ██████  ███████ ███████  ██████ ████████ ██  ██████  ███    ██       ██████   █████  ██████   █████  ███    ███ ███████ 
                                // ██      ██    ██ ██   ██ ██      ██      ██         ██    ██ ██    ██ ████   ██       ██   ██ ██   ██ ██   ██ ██   ██ ████  ████ ██      
                                // ███████ ██    ██ ██████  ███████ █████   ██         ██    ██ ██    ██ ██ ██  ██ █████ ██████  ███████ ██████  ███████ ██ ████ ██ ███████ 
                                //      ██ ██    ██ ██   ██      ██ ██      ██         ██    ██ ██    ██ ██  ██ ██       ██      ██   ██ ██   ██ ██   ██ ██  ██  ██      ██ 
                                // ███████  ██████  ██████  ███████ ███████  ██████    ██    ██  ██████  ██   ████       ██      ██   ██ ██   ██ ██   ██ ██      ██ ███████ 
                                                                                                                                                                                                         

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


                            //  █████  ███    ██  █████  ██      ██    ██ ███████ ██ ███████     ██ ██████  ██████  ███████  █████  ██   ██ ███████ 
                            // ██   ██ ████   ██ ██   ██ ██       ██  ██  ██      ██ ██         ██  ██   ██ ██   ██ ██      ██   ██ ██  ██  ██      
                            // ███████ ██ ██  ██ ███████ ██        ████   ███████ ██ ███████   ██   ██████  ██████  █████   ███████ █████   ███████ 
                            // ██   ██ ██  ██ ██ ██   ██ ██         ██         ██ ██      ██  ██    ██   ██ ██   ██ ██      ██   ██ ██  ██       ██ 
                            // ██   ██ ██   ████ ██   ██ ███████    ██    ███████ ██ ███████ ██     ██████  ██   ██ ███████ ██   ██ ██   ██ ███████ 


                            report_param_object['Hide_Analysis'] = "false"
                            if(subsection.sectionsubsections.show_analysis_box === false){
                                report_param_object['Hide_Analysis'] = "true"
                            }


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
                                    ,subsection_param_object.Hide_Analysis = report_param_object['Hide_Analysis']
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

                            subsection_count++

                        })
                    }

                })
            }
            */