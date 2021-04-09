const models = require("../models");
const database = require('../util/database')
const databaseQueriesUtil = require('../util/database_queries2');


exports.reset = async() => {
    await models.SubSectionParameter.drop()
    await models.Parameter.drop()    
    await models.SectionSubSection.drop()
    await models.SubSection.drop()
    await models.Section.drop()
    await models.SubscriptionActivity.drop()    
    await models.Subscription.drop()    
    await models.Frequency.drop()        
    await models.Report.drop()        
}

exports.test = async() => {

    // await exports.reset()
    // await database.sequelize.sync()

    // creation_list = []
    // creation_list.push(
    // {
    //     model: "SubSection",
    //     params: [

    //     //TOTAL VOLUME FLOW DIAGRAM

    //     {
    //         order: 1.001,
    //         name: "Support Requests - Source per period",
    //         path_snapshot: "/99 - Test Reports/Service Report/Support Requests - Source per period_SNP",
    //         path_warehouse: "/99 - Test Reports/Service Report/Support Requests - Source per period_WH"
    //     },   

    //     ]
    // },    
    // )
    // databaseQueriesUtil.createData2(creation_list)
    // console.log("TEST COMPLETE")

    models["SubSection"].create(

        {
            order: 1.001,
            name: "Support Requests - Source per period",
            path_snapshot: "/99 - Test Reports/Service Report/Support Requests - Source per period_SNP",
            path_warehouse: "/99 - Test Reports/Service Report/Support Requests - Source per period_WH"
        } 
    )
    .then((subsection)=> {
        console.log("SUBSECTION INSERTED")
    })
}

exports.create = async() => {
    //RESET THE TABLES 

    try{

    await exports.reset()

    await database.sequelize.sync()

    let creation_list = [];



    creation_list = []
    creation_list.push(
    {
        model: "SubSection",
        params: [


        {
            order: 0,
            name: "SLA - Summary - full period",
            path_snapshot: "/99 - Test Reports/Service Report/SLA - Summary - full period_SNP",
            path_warehouse: "/99 - Test Reports/Service Report/SLA - Summary - full period_SNP"
        },  

        {
            order: 1.000,
            name: "Support Requests - Total Volume Flow Diagram - single period",
            path_snapshot: "/99 - Test Reports/Service Report/Support Requests - Total Volume Flow Diagram - single period_SNP",
            path_warehouse: "/99 - Test Reports/Service Report/Support Requests - Total Volume Flow Diagram - single period_SNP",
            period_type: "single"
        },   

        {
            order: 1.001,
            name: "Support Requests - Source - full period",
            path_snapshot: "/99 - Test Reports/Service Report/Support Requests - Source - full period_SNP",
            path_warehouse: "/99 - Test Reports/Service Report/Support Requests - Source - full period_WH"
        },   

        {
            order: 1.002,
            name: "Support Requests - Location - full period",
            path_snapshot: "/99 - Test Reports/Service Report/Support Requests - Location - full period_SNP",
            path_warehouse: "/99 - Test Reports/Service Report/Support Requests - Location - full period_WH"
        },   

        {
            order: 1.003,
            name: "Support Requests - Time of Day - full period",
            path_snapshot: "/99 - Test Reports/Service Report/Support Requests - Time of Day - full period_SNP",
            path_warehouse: "/99 - Test Reports/Service Report/Support Requests - Time of Day - full period_WH"
        },   

        {
            order: 1.004,
            name: "Support Requests - Heatmaps for Total Registered Tickets - single and full period",
            path_snapshot: "/99 - Test Reports/Service Report/Support Requests - Heatmaps for Total Registered Tickets - single and full period_SNP",
            path_warehouse: "/99 - Test Reports/Service Report/Support Requests - Heatmaps for Total Registered Tickets - single and full period_WH",
            period_type: 'both'
        },   


        {
            order: 2.0001,
            name: "Incidents - Major Incident Review - single period",
            path_snapshot: "/99 - Test Reports/Service Report/Incidents - Major Incident Review - single period_SNP",
            path_warehouse: "/99 - Test Reports/Service Report/Incidents - Major Incident Review - single period_WH",
            period_type: 'single'
        },    
        
        {
            order: 2.0012,
            name: "Incidents - FCR - full period",
            path_snapshot: "/99 - Test Reports/Service Report/Incidents - FCR - full period_SNP",
            path_warehouse: "/99 - Test Reports/Service Report/Incidents - FCR - full period_WH"
        },    
        
        {
            order: 2.0013,
            name: "Incidents - Category Trends - full period",
            path_snapshot: "/99 - Test Reports/Service Report/Incidents - Category Trends - full period_SNP",
            path_warehouse: "/99 - Test Reports/Service Report/Incidents - Category Trends - full period_SNP"
        },    

        {
            order: 2.00131,
            name: "Incidents - Top 5 Categories with Subcategory breakdown - single period",
            path_snapshot: "/99 - Test Reports/Service Report/Incidents - Top 5 Category and Subcategory - single period_SNP",
            path_warehouse: "/99 - Test Reports/Service Report/Incidents - Top 5 Category and Subcategory - single period_WH",
            period_type: 'single'
        },    

        {
            order: 2.002,
            name: "Incidents - Opened and Resolved - full period",
            path_snapshot: "/99 - Test Reports/Service Report/Incidents - Opened and Resolved - full period_SNP",
            path_warehouse: "/99 - Test Reports/Service Report/Incidents - Opened and Resolved - full period_WH"
        },           
        {
            order: 2.003,
            name: "Incidents - Opened and Resolved per resolver group - full period",
            path_snapshot: "/99 - Test Reports/Service Report/Incidents - Opened and Resolved per resolver group - full period_SNP",
            path_warehouse: "/99 - Test Reports/Service Report/Incidents - Opened and Resolved per resolver group - full period_WH"
        },            
        {
            order: 2.004,
            name: "Incidents - Priority - full period",
            path_snapshot: "/99 - Test Reports/Service Report/Incidents - Priority - full period_SNP",
            path_warehouse: "/99 - Test Reports/Service Report/Incidents - Priority - full period_WH"
        },       


        {
            order: 3,
            name: "Requests - Top 5 Categories with Subcategory - single period",
            path_snapshot: "/99 - Test Reports/Service Report/Requests - Top 5 Category and Subcategory - single period_SNP",
            path_warehouse: "/99 - Test Reports/Service Report/Requests - Top 5 Category and Subcategory - single period_WH",
            period_type: 'single'
        },    


        {
            order: 4,
            name: "Problems - Open and Closed - single period",
            path_snapshot: "/99 - Test Reports/Service Report/Problems - Open and Closed - single period_SNP",
            path_warehouse: "/99 - Test Reports/Service Report/Problems - Open and Closed - single period_WH",
            period_type: 'single'
        },       
        {
            order: 4.001,
            name: "Problems - Open and Closed - full period",
            path_snapshot: "/99 - Test Reports/Service Report/Problems - Open and Closed - full period_SNP",
            path_warehouse: "/99 - Test Reports/Service Report/Problems - Open and Closed - full period_WH"
        }, 



        {
            order: 5.001,
            name: "CSAT - Customer Satisfaction Measurements - single period",
            path_snapshot: "/99 - Test Reports/Service Report/CSAT - Customer Satisfaction Measurements - single period_SNP",
            path_warehouse: "/99 - Test Reports/Service Report/CSAT - Customer Satisfaction Measurements - single period_SNP",
            period_type: 'single'
        },  

        {
            order: 5.002,
            name: "CSAT - Service Feedback Summary - single period",
            path_snapshot: "/99 - Test Reports/Service Report/CSAT - Service Feedback Summary - single period_WH",
            path_warehouse: "/99 - Test Reports/Service Report/CSAT - Service Feedback Summary - single period_WH",
            period_type: 'single'
        },  

        {
            order: 5.003,
            name: "CSAT - Summary - full period",
            path_snapshot: "/99 - Test Reports/Service Report/CSAT - Summary - full period_SNP",
            path_warehouse: "/99 - Test Reports/Service Report/CSAT - Summary - full period_WH"
        },  

        {
            order: 6.001,
            name: "Telephony - Summary - full period",
            path_snapshot: "/99 - Test Reports/Service Report/Telephony - Summary - full period_WH",
            path_warehouse: "/99 - Test Reports/Service Report/Telephony - Summary - full period_WH"
        },   


        {
            order: 10.001,
            name: "Appendix - CSAT - Positive Customer Feedback - single period",
            path_snapshot: "/99 - Test Reports/Service Report/Appendix - CSAT - Positive Customer Feedback - single period_WH",
            path_warehouse: "/99 - Test Reports/Service Report/Appendix - CSAT - Positive Customer Feedback - single period_WH",
            period_type: 'single',
            type: 'appendix'
        },             

        {
            order: 10.0011,
            name: "Appendix - Trended Volumes for Reference - full period",
            path_snapshot: "/99 - Test Reports/Service Report/Appendix - Trended Volumes for Reference - full period_SNP",
            path_warehouse: "/99 - Test Reports/Service Report/Appendix - Trended Volumes for Reference - full period_SNP",
            type: 'appendix'
        },            

        {
            order: 10.002,
            name: "Appendix - Category Trends Top 15 - full period",
            path_snapshot: "/99 - Test Reports/Service Report/Appendix - Category Trends Top 15 - full period_SNP",
            path_warehouse: "/99 - Test Reports/Service Report/Appendix - Category Trends Top 15 - full period_WH",
            type: 'appendix'
        },           


        {
            order: 20.001,
            name: "Template - Executive Summary",
            path_snapshot: "/99 - Test Reports/Service Report/Template - Executive Summary",
            path_warehouse: "/99 - Test Reports/Service Report/Template - Executive Summary",
            period_type: "",
            type: 'template'
        },  
        {
            order: 20.002,
            name: "Template - Actions Register",
            path_snapshot: "/99 - Test Reports/Service Report/Template - Actions Register",
            path_warehouse: "/99 - Test Reports/Service Report/Template - Actions Register",
            period_type: "",
            type: 'appendix template'
        },  

        ]
    },    
    )

    let subsections = await databaseQueriesUtil.createData2(creation_list)



    creation_list = []
    creation_list.push(
    {
        model: "Parameter",
        params: [
        // {
        //     order: 1,
        //     name: "report_name",
        //     query: ""
        // },
        {
            order: 0,
            name: "database",
            query: "SELECT 'snapshot' AS value UNION SELECT 'warehouse' AS value",
            in_report: 0,
            parameter_type: 'all'
        },          
        {
            order: 0,
            name: "Section_Name",
            query: "",
            visible: 0,
            parameter_type: 'all'
        },
        {
            order: 0,
            name: "Subsection_Name",
            query: "",
            visible: 0,
            parameter_type: 'all'
        },            
        {
            order: 0,
            name: "Add_Analysis_Box",
            query: "",
            visible: 0,
            parameter_type: 'all'
        },   

        {
            order: 2,
            name: "company_filter",
            query: 'SELECT dim_orgunit_cleaned AS value FROM DIMENSION_orgunit ORDER BY dim_orgunit_cleaned',
            parameter_type: 'all'
        },
        {
            order: 2.1,
            name: "source_table",
            query: "",
            parameter_type: 'all'
        },

        {
            order: 0.012,
            name: "period_type",
            query: "SELECT type AS name ,value FROM [dbo].[daterange_view]",
            parameter_type: 'full'
        },          
        {
            order: 0.0121,
            name: "date_start",
            query: "",
            parameter_type: 'full'
        },  
        {
            order: 0.0122,
            name: "date_end",
            query: "",
            parameter_type: 'full'
        },          


        {
            order: 0.013,
            name: "period_type_sp",
            query: "SELECT type AS name ,value FROM [dbo].[daterange_view]",
            parameter_type: 'single'
        },          
        {
            order: 0.0131,
            name: "date_start_sp",      
            query: "",
            parameter_type: 'single'
        },  
        {
            order: 0.0132,
            name: "date_end_sp",       
            query: "",
            parameter_type: 'single'
        },        

        {
            order: 0.0141,
            name: "core_hours_start",       
            query: "",
            parameter_type: 'data'
        },        
        {
            order: 0.0142,
            name: "core_hours_end",       
            query: "",
            parameter_type: 'data'
        },        

        {
            order: 0.0151,
            name: "customer_filter",       
            query: "",
            parameter_type: 'data'
        },        
        {
            order: 0.0152,
            name: "third_party_filter",       
            query: "",
            parameter_type: 'data'
        },    
        {
            order: 0.0153,
            name: "telephony_sla_target",       
            query: "",
            parameter_type: 'data'
        },   



 
        // {
        //     order: 0.019,
        //     name: "selected_slas",
        //     query: 
        //     `
        //     SELECT
        //     'Telephones answered within 20 seconds' AS name,
        //     'a' AS value
            
        //     UNION ALL
        //     SELECT
        //     'Telephones answered within 30 seconds' AS name,
        //     'o' AS value
            
        //     UNION ALL
        //     SELECT
        //     'Telephones answered within 40 seconds' AS name,
        //     'p' AS value
            
        //     UNION ALL
        //     SELECT
        //     'Telephone and LF Live FCR rate' AS name,
        //     'b' AS value
            
        //     UNION ALL
        //     SELECT
        //     'Availability of any of the Service Desk channels' AS name,
        //     'c' AS value
            
        //     UNION ALL
        //     SELECT
        //     'Priority 1 Incident Response' AS name,
        //     'd' AS value
            
        //     UNION ALL
        //     SELECT
        //     'Priority 2 Incident Response' AS name,
        //     'e' AS value
            
        //     UNION ALL
        //     SELECT
        //     'Priority 3 Incident Response' AS name,
        //     'f' AS value
            
        //     UNION ALL
        //     SELECT
        //     'Combined Incident Response' AS name,
        //     'g' AS value
            
        //     UNION ALL
        //     SELECT
        //     'Priority 1 Incident Resolution' AS name,
        //     'h' AS value
            
        //     UNION ALL
        //     SELECT
        //     'Priority 2 Incident Resolution' AS name,
        //     'i' AS value
            
        //     UNION ALL
        //     SELECT
        //     'Priority 3 Incident Resolution' AS name,
        //     'j' AS value
            
        //     UNION ALL
        //     SELECT
        //     'Combined Incident Resolution' AS name,
        //     'k' AS value
            
        //     UNION ALL
        //     SELECT
        //     'p3-p5 Incident Resolution' AS name,
        //     'n' AS value
            
        //     UNION ALL
        //     SELECT
        //     'Incidents older than 1 month' AS name,
        //     'l' AS value
            
        //     UNION ALL
        //     SELECT
        //     'Changes implemented successfully at first attempt' AS name,
        //     'm' AS value
            
        //     UNION ALL
        //     SELECT
        //     'Volume of Incidents Re-opened' AS name,
        //     'q' AS value
            
        //     UNION ALL
        //     SELECT
        //     'Priority 1 Incident Response (No Monitoring)' AS name,
        //     'r' AS value
            
        //     UNION ALL
        //     SELECT
        //     'Priority 2 Incident Response (No Monitoring)' AS name,
        //     's' AS value
            
        //     UNION ALL
        //     SELECT
        //     'Priority 1 Incident Resolution (No Monitoring)' AS name,
        //     't' AS value
            
        //     UNION ALL
        //     SELECT
        //     'Priority 2 Incident Resolution (No Monitoring)' AS name,
        //     'u' AS value
            
        //     UNION ALL
        //     SELECT
        //     'Combined Incident Resolution (No Monitoring)' AS name,
        //     'v' AS value
            
        //     UNION ALL
        //     SELECT
        //     'Incidents older than 1 month (No Monitoring)' AS name,
        //     'w' AS value
            
        //     UNION ALL
        //     SELECT
        //     'Incidents older than 1 month (No P4s)' AS name,
        //     'x' AS value            
        //     `,
        //     parameter_type: 'sla'
        // },   

        {
            order: 0.01901,
            name: "ddi_filter",       
            query: "",
            parameter_type: 'sla'
        },    
        {
            order: 0.01902,
            name: "telephony_20second_target",       
            query: "",
            parameter_type: 'sla'
        },    
        {
            order: 0.01903,
            name: "telephony_30second_target",       
            query: "",
            parameter_type: 'sla'
        },  
        {
            order: 0.01904,
            name: "telephony_40second_target",       
            query: "",
            parameter_type: 'sla'
        },          

        {
            order: 0.01905,
            name: "fcr_target",       
            query: "",
            parameter_type: 'sla'
        },     
        {
            order: 0.01906,
            name: "old_incidents_target",       
            query: "",
            parameter_type: 'sla'
        },     
        {
            order: 0.01907,
            name: "successfyul_changes_target",       
            query: "",
            parameter_type: 'sla'
        },   
        {
            order: 0.01908,
            name: "p1_response_time",       
            query: "",
            parameter_type: 'sla'
        },   
        {
            order: 0.01909,
            name: "p2_response_time",       
            query: "",
            parameter_type: 'sla'
        },   
        {
            order: 0.01910,
            name: "p3_response_time",       
            query: "",
            parameter_type: 'sla'
        },           
        {
            order: 0.01911,
            name: "p1_response_target",       
            query: "",
            parameter_type: 'sla'
        },   
        {
            order: 0.01912,
            name: "p2_response_target",       
            query: "",
            parameter_type: 'sla'
        },   
        {
            order: 0.01913,
            name: "p3_response_target",       
            query: "",
            parameter_type: 'sla'
        },           

        {
            order: 0.01914,
            name: "priority1_hours",       
            query: "",
            parameter_type: 'sla'
        },   
        {
            order: 0.01915,
            name: "priority2_hours",       
            query: "",
            parameter_type: 'sla'
        },   
        {
            order: 0.01916,
            name: "priority3_hours",       
            query: "",
            parameter_type: 'sla'
        },           
        {
            order: 0.01917,
            name: "priority1_target",       
            query: "",
            parameter_type: 'sla'
        },   
        {
            order: 0.01918,
            name: "priority2_target",       
            query: "",
            parameter_type: 'sla'
        },   
        {
            order: 0.01919,
            name: "priority3_target",       
            query: "",
            parameter_type: 'sla'
        },         
        {
            order: 0.01920,
            name: "P3toP5_resolution_target",       
            query: "",
            parameter_type: 'sla'
        },      
        {
            order: 0.01921,
            name: "combined_response_target",       
            query: "",
            parameter_type: 'sla'
        },     
        {
            order: 0.01922,
            name: "combined_sla_target",       
            query: "",
            parameter_type: 'sla'
        },  
        {
            order: 0.01923,
            name: "aged_ticket_days",
            query: "",
            parameter_type: 'sla'
        },   
        {
            order: 0.01924,
            name: "reopened_tickets_target",
            query: "",
            parameter_type: 'sla'
        },   


        ]
    }) 

    let parameters = await databaseQueriesUtil.createData2(creation_list)


    // creation_list = []
    // creation_list.push(
    // {
    //     model: "SubSectionParameter",
    //     params: []
    // },    
    // )

    // parameters.forEach((parameter) => {
    //     subsections.forEach((subsection) => {

    //         creation_list[0].params.push({
    //             subsectionId: subsection.id,
    //             parameterId: parameter.id
    //         })
    //     })

    // })

    // let subsectionparameters = await databaseQueriesUtil.createData2(creation_list)



    creation_list = []
    creation_list.push(
    {
        model: "Report",
        params: [
        {
            name: "Service Report"
            ,description: "A template for the regularly used SSRS Service Report"
            ,owner: "93e16e04-771c-4137-b169-748d2dc103c3"
        },      
        // {
        //     name: "Service Report - Not Owned"
        //     ,description: "A copy of the Service Report not owned by the Admin to show what uneditable reports will look and act like"
        //     ,owner: ""
        // },                 
        ]
    },    
    )

    let reports = await databaseQueriesUtil.createData2(creation_list)

    creation_list = []
    creation_list.push(
    {
        model: "Section",
        params: [    
            {
                name: "Executive Summary",
                order: 1,
                reportId: reports[0].id
            },  
            {
                name: "Service Desk",
                order: 2,
                reportId: reports[0].id
            },   
            {
                name: "Incident Management",
                order: 3,
                reportId: reports[0].id
            },              
            {
                name: "Requests",
                order: 4,
                reportId: reports[0].id
            },        
            {
                name: "Problem Management",
                order: 5,
                reportId: reports[0].id
            },                  
            {
                name: "Service Review Meetings Actions Register",
                order: 6,
                reportId: reports[0].id
            },    
            {
                name: "Appendix A - Positive Customer Feedback",
                order: 7,
                reportId: reports[0].id
            },    
            {
                name: "Appendix B - Trended Volumes for Reference",
                order: 8,
                reportId: reports[0].id
            },   
            {
                name: "Appendix C - Category Trends - Within Top 15 Category Types",
                order: 9,
                reportId: reports[0].id
            },   
            

        ]
    })
    
    let sections = await databaseQueriesUtil.createData2(creation_list)



    // creation_list = []
    // creation_list.push(
    // {
    //     model: "SectionSubSection",
    //     params: [

    //     {
    //         order: 1,
    //         name: "",
    //         sectionId: sections[0].id,
    //         subsectionId: subsections[0].id
    //     },         
    //     {
    //         order: 1,
    //         name: "",
    //         sectionId: sections[1].id,
    //         subsectionId: subsections[1].id
    //     },     

    //     ]
    // },    
    // )

    // let sectionsubsections = await databaseQueriesUtil.createData2(creation_list)





    creation_list = []
    creation_list.push(
    {
        model: "Frequency",
        params: [
        {
            name: "Daily"
        }, 
        {
            name: "Weekly"
        }, 
        {
            name: "Monthly"
        },                                              
        ]
    },    
    )

    let frequencies = await databaseQueriesUtil.createData2(creation_list)



    creation_list = []
    creation_list.push(
    {
        model: "Subscription",
        params: [
        {
            reportId: reports[0].id,
            frequencyId: frequencies[0].id,
            name: "Warehouse Fusion Test",
            email_to: "thomas.cassady@littlefish.co.uk",
            subject: "Test Service Report",
            body: "please find attached your copy of the service report",
            start_date: "2020-10-27",
            time: "16:01",     
            parameters: `
            {
                "database": "warehouse", 
                "report_name": "Service Report", 
                "company_filter": "Fusion Lifestyle", 
                "source_table": "LF_FusionLifestyle", 
                "period_type": "8",
                "date_start": "01/01/2000", 
                "date_end": "01/01/2000",
                "period_type_sp": "1",
                "date_start_sp": "01/01/2000", 
                "date_end_sp": "01/01/2000",

                "aged_ticket_days": "30",

                "core_hours_start": "6",
                "core_hours_end": "18",
                "customer_filter": "_No Teams",
                "third_party_filter": "SAM Team", 

                "telephony_sla_target": "0.85",
                "ddi_filter": "Fusion Lifestyle",
                "telephony_20second_target": "0.85",
                "telephony_30second_target": "0.9",
                "telephony_40second_target": "0.99",
                "fcr_target": "0.7",
                "old_incidents_target": "0.015",
                "successfyul_changes_target": "0.95",
                "p1_response_time": "15 minutes",
                "p2_response_time": "30 minutes",
                "p3_response_time": "2 hours",
                "p1_response_target": "0.9",
                "p2_response_target": "0.9",
                "p3_response_target": "0.9",
                "priority1_hours": "4 hours",
                "priority2_hours": "8 hours",
                "priority3_hours": "72 hours",
                "priority1_target": "0.9",
                "priority2_target": "0.9",
                "priority3_target": "0.9",
                "P3toP5_resolution_target": "0.95",
                "combined_response_target": "0.95",
                "combined_sla_target": "0.95",
                "aged_ticket_days": "30",
                "reopened_tickets_target": "0.02"   

            }`,              
        },       

        {
            reportId: reports[0].id,
            frequencyId: frequencies[0].id,
            name: "Snapshot Fusion Test",
            email_to: "thomas.cassady@littlefish.co.uk",
            subject: "Test Service Report",
            body: "please find attached your copy of the service report",
            start_date: "2020-10-27",
            time: "16:01",     
            parameters: `
            {
                "database": "snapshot", 
                "report_name": "Service Report", 
                "company_filter": "Fusion Lifestyle", 
                "source_table": "LF_FusionLifestyle", 
                "period_type": "8",
                "date_start": "01/01/2000", 
                "date_end": "01/01/2000",
                "period_type_sp": "1",
                "date_start_sp": "01/01/2000", 
                "date_end_sp": "01/01/2000",

                "aged_ticket_days": "30",

                "core_hours_start": "8",
                "core_hours_end": "18",
                "customer_filter": "_No Teams",
                "third_party_filter": "SAM Team",
            
                "telephony_sla_target": "0.85",
                "ddi_filter": "Fusion Lifestyle",
                "telephony_20second_target": "0.85",
                "telephony_30second_target": "0.9",
                "telephony_40second_target": "0.99",
                "fcr_target": "0.7",
                "old_incidents_target": "0.015",
                "successfyul_changes_target": "0.95",
                "p1_response_time": "15 minutes",
                "p2_response_time": "30 minutes",
                "p3_response_time": "2 hours",
                "p1_response_target": "0.9",
                "p2_response_target": "0.9",
                "p3_response_target": "0.9",
                "priority1_hours": "4 hours",
                "priority2_hours": "8 hours",
                "priority3_hours": "72 hours",
                "priority1_target": "0.9",
                "priority2_target": "0.9",
                "priority3_target": "0.9",
                "P3toP5_resolution_target": "0.95",
                "combined_response_target": "0.95",
                "combined_sla_target": "0.95",
                "aged_ticket_days": "30",
                "reopened_tickets_target": "0.02"                

            }`,              
        },     

//                "selected_slas": "a,b,c,d,e,f,g,h,i,j,k,l,m",

        ]
    },    
    )

    let subscriptions = await databaseQueriesUtil.createData2(creation_list)


    console.log("seeding complete")


    
    }    
    catch(err){
        console.log(err)

    }

}


exports.createTests = async(req,res) => { //, middleware.isLoggedIn

    await exports.create();
    
    res.send("creation complete")    
};

