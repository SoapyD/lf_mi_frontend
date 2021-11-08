const models = require("../models");
const database = require('../utils/database')
const databaseQueriesUtil = require('../utils/database_queries2');


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

// exports.test = async() => {

//     await exports.reset()
//     await database.sequelize.sync()

//     creation_list = []
//     creation_list.push(
//     {
//         model: "SubSection",
//         params: [

//         //TOTAL VOLUME FLOW DIAGRAM

//         {
//             order: 1.001,
//             name: "Support Requests - Source per period",
//             path: "/99 - Test Reports/Service Report/Support Requests - Source per period_SNP",
//             path_warehouse: "/99 - Test Reports/Service Report/Support Requests - Source per period_WH"
//         },   

//         ]
//     },    
//     )
//     databaseQueriesUtil.createData2(creation_list)
//     console.log("TEST COMPLETE")

//     models["SubSection"].create(

//         {
//             order: 1.001,
//             name: "Support Requests - Source per period",
//             path: "/99 - Test Reports/Service Report/Support Requests - Source per period_SNP",
//             path_warehouse: "/99 - Test Reports/Service Report/Support Requests - Source per period_WH"
//         } 
//     )
//     .then((subsection)=> {
//         console.log("SUBSECTION INSERTED")
//     })
// }

exports.create = async() => {
    //RESET THE TABLES 

    try{

    await exports.reset()

    await database.sequelize.sync()

    let creation_list = [];


    let subsection_root = '/99 - Test Reports/Service Report/Live/'
    let template_root = '/99 - Test Reports/Service Report/Templates/'    

    creation_list = []
    creation_list.push(
    {
        model: "SubSection",
        params: [


        {
            order: 0,
            name: "SLA - SLA Summary - full period",
            path: subsection_root+"SLA - SLA Summary - full period_WH02",
        },  

        //--------------------------------------------------------SUPPORT REQUESTS

        {
            order: 1.000,
            name: "Support Requests - Total Volume Flow Diagram - single period",
            path: subsection_root+"Support Requests - Total Volume Flow Diagram - single period_WH02",
            period_type: "both"
        },   

        {
            order: 1.001,
            name: "Support Requests - Source - full period",
            path: subsection_root+"Support Requests - Source - full period_WH02",
        },   

        {
            order: 1.002,
            name: "Support Requests - Location - full period",
            path: subsection_root+"Support Requests - Location - full period_WH02"
        },   
        {
            order: 1.00201,
            name: "Support Requests - Business Unit - full period",
            path: subsection_root+"Support Requests - Business Unit - full period_WH02"
        },           

        {
            order: 1.003,
            name: "Support Requests - Time of Day - full period",
            path: subsection_root+"Support Requests - Time of Day - full period_WH02"
        },   

        {
            order: 1.004,
            name: "Support Requests - Heatmaps for Total Registered Tickets - single and full period",
            path: subsection_root+"Support Requests - Heatmap for Total Registered Tickets - single and full period_WH02",
            period_type: 'both'
        },   

        {
            order: 1.005,
            name: "Support Requests - Top 10 VIP Users Raising Tickets - single period",
            path: subsection_root+"Support Requests - Top 10 VIP Users Raising Tickets - single period_WH02",
            period_type: 'single'
        },    
        {
            order: 1.006,
            name: "Support Requests - VIP - full period",
            path: subsection_root+"Support Requests - VIP - full period_WH02",
        },

        {
            order: 1.007,
            name: "Support Requests - Volume by Type Per Period - full period",
            path: subsection_root+"Support Requests - Volume by Type - full period_WH02",
        },            

        {
            order: 1.008,
            name: "Support Requests - Trending per Month per Resolver Team - full period",
            path: subsection_root+"Support Requests - Trending per Month per Resolver Team - full period_WH02",
        },    

        {
            order: 1.009,
            name: "Support Requests - Registered Resolved and Open Summary - single period",
            path: subsection_root+"Support Requests - Registered Resolved and Open Summary - single period_WH02",
            period_type: 'single'
        },   
        
        {
            order: 1.010,
            name: "Support Requests - Resolved and Open by Ownerteam - single period",
            path: subsection_root+"Support Requests - Resolved and Open by Ownerteam - single period_WH02",
            period_type: 'single'
        },           

        {
            order: 1.02,
            name: "Support Requests - Customer Experience Mean Elapsed Time by Location - full period",
            path: subsection_root+"Support Requests - Customer Experience Mean Elapsed Time by Location - full period_WH02",
        },
        {
            order: 1.0201,
            name: "Support Requests - Customer Experience Mean Elapsed Time by VIP Status - full period",
            path: subsection_root+"Support Requests - Customer Experience Mean Elapsed Time by VIP Status - full period_WH02",
        },



        //--------------------------------------------------------INCIDENTS

        {
            order: 2.0001,
            name: "Incidents - Major Incident Review - single period",
            path: subsection_root+"Incidents - Major Incident Review - single period_WH02",
            period_type: 'single'
        },    
        
        {
            order: 2.0012,
            name: "Incidents - FCR - full period",
            path: subsection_root+"Incidents - FCR - full period_WH02"
        },    
        
        {
            order: 2.0013,
            name: "Incidents - Top 5 Category Trends - full period",
            path: subsection_root+"Incidents - Top 5 Category Trends - full period_WH02",
        },    

        {
            order: 2.00131,
            name: "Incidents - Top 5 Categories with Subcategory breakdown - single period",
            path: subsection_root+"Incidents - Top 5 Categories - single period_WH02",
            period_type: 'single'
        },    

        {
            order: 2.002,
            name: "Incidents - Opened and Resolved - full period",
            path: subsection_root+"Incidents - Opened and Resolved - full period_WH02"
        },           

        {
            order: 2.03,
            name: "Incidents - Closed by Littlefish - full period",
            path: subsection_root+"Incidents - Closed by Littlefish - full period_WH02",
        },        
        {
            order: 2.031,
            name: "Incidents - Closed by Non LF Resolvers - full period",
            path: subsection_root+"Incidents - Closed by Non LF Resolvers - full period_WH02",
        },
        {
            order: 2.032,
            name: "Incidents - Closed by All Resolver Groups - full period",
            path: subsection_root+"Incidents - Closed by All Resolver Groups - full period_WH02",
        },

        {
            order: 2.004,
            name: "Incidents - Priority - full period",
            path: subsection_root+"Incidents - Priority - full period_WH02",
        },       

        {
            order: 2.005,
            name: "Incidents - Customer Experience Mean Time to Resolution by Priority - full period",
            path: subsection_root+"Incidents - Customer Experience Mean Time to Resolution by Priority - full period_WH02",
        },
        {
            order: 2.006,
            name: "Incidents - SLA Clock Mean Time to Resolution by Priority - full period",
            path: subsection_root+"Incidents - SLA Clock Mean Time to Resolution by Priority - full period_WH02",
        },

        {
            order: 2.007,
            name: "Incidents - Tail by Resolver Group - single period",
            path: subsection_root+"Incidents - Tail by Resolver Group - single period_WH02",
            period_type: 'both',            
        },
        {
            order: 2.008,
            name: "Incidents - Top 10 Users Raising Incidents - single period",
            path: subsection_root+"Incidents - Top 10 Users Raising Incidents - single period_WH02",
            period_type: 'single',            
        },
        {
            order: 2.009,
            name: "Incidents - Master vs Child Incidents - full period",
            path: subsection_root+"Incidents - Master vs Child Incidents - full period_WH02",
            period_type: 'full',            
        },




        //--------------------------------------------------------REQUESTS

        
        {
            order: 3,
            name: "Requests - Top 5 Category Trends - full period",
            path: subsection_root+"Requests - Top 5 Category Trends - full period_WH02",
        },    

        {
            order: 3.0009,
            name: "Requests - Top 5 Categories with Subcategory breakdown - single period",
            path: subsection_root+"Requests - Top 5 Categories - single period_WH02",
            period_type: 'single'
        },    

        {
            order: 3.001,
            name: "Requests - Priority - full period",
            path: subsection_root+"Requests - Priority - full period_WH02",
        },

        {
            order: 3.002,
            name: "Requests - Customer Experience Mean Time to Resolution by Priority - full period",
            path: subsection_root+"Requests - Customer Experience Mean Time to Resolution by Priority - full period_WH02",
        },
        {
            order: 3.003,
            name: "Requests - SLA Clock Mean Time to Resolution by Priority - full period",
            path: subsection_root+"Requests - SLA Clock Mean Time to Resolution by Priority - full period_WH02",
        },

        {
            order: 3.004,
            name: "Requests - Resolution Performance - full period",
            path: subsection_root+"Requests - Resolution Performance - full period_WH02",
        },

        //--------------------------------------------------------PROBLEM        

        {
            order: 4,
            name: "Problems - Open and Closed - single period",
            path: subsection_root+"Problems - Open and Closed - single period_WH02",
            period_type: 'single'
        },       
        {
            order: 4.001,
            name: "Problems - Opened and Closed - full period",
            path: subsection_root+"Problems - Opened and Closed - full period_WH02",
        }, 

        //--------------------------------------------------------CHANGE         

        {
            order: 5.002,
            name: "Change - Status - full period",
            path: subsection_root+"Change - Status - full period_WH02",
        },
        {
            order: 5.003,
            name: "Change - Type of Change - full period",
            path: subsection_root+"Change - Type of Change - full period_WH02",
        },
        {
            order: 5.004,
            name: "Change - Implementation - full period",
            path: subsection_root+"Change - Implementation - full period_WH02",
        },
        {
            order: 5.004,
            name: "Change - Implementation Result - full period",
            path: subsection_root+"Change - Implementation Result - full period_WH02",
        },

        //--------------------------------------------------------KNOWLEDGE            

        // {
        //     order: 6,
        //     name: "Knowledge - Base Growth - full period",
        //     path: subsection_root+"Knowledge - Base Growth - full period_WH02",
        // },


        //--------------------------------------------------------CSAT

        {
            order: 7.001,
            name: "CSAT - CSAT Overview - single period",
            path: subsection_root+"CSAT - CSAT Overview - single period_WH02",
            period_type: 'single'
        },  

        {
            order: 7.002,
            name: "CSAT - CSAT Feedback - single period",
            path: subsection_root+"CSAT - CSAT Feedback - single period_WH02",
            period_type: 'single'
        },  

        {
            order: 7.003,
            name: "CSAT - CSAT Summary - full period",
            path: subsection_root+"CSAT - CSAT Summary - full period_WH02",
        },  

        {
            order: 7.004,
            name: "CSAT - NPS Summary - full period",
            path: subsection_root+"CSAT - NPS Summary - full period_WH02",
        },            
        {
            order: 7.005,
            name: "CSAT - NPS Feedback - single period",
            path: subsection_root+"CSAT - NPS Feedback - single period_WH02",
            period_type: 'single',
        },            

        //--------------------------------------------------------TELEPHONY

        {
            order: 8.001,
            name: "Telephony - Summary - full period",
            path: subsection_root+"Telephony - Summary - full period_WH02",
        },   

        {
            order: 8.02,
            name: "Telephony - Abandoned Call Heatmaps - single period",
            path: subsection_root+"Telephony - Heatmaps for Total Abandoned Calls - single period_WH02",
            period_type: 'single'
        },         

        //--------------------------------------------------------CI

        //--------------------------------------------------------APPENDIX

        {
            order: 10.001,
            name: "Appendix - CSAT - Positive CSAT Feedback - single period",
            path: subsection_root+"Appendix - CSAT - Positive CSAT Feedback - single period_WH02",
            period_type: 'single',
            type: 'appendix'
        },             

        {
            order: 10.002,
            name: "Appendix - CSAT - Positive NPS Feedback - single period",
            path: subsection_root+"Appendix - CSAT - Positive NPS Feedback - single period_WH02",
            period_type: 'single',            
            type: 'appendix'
        }, 

        {
            order: 10.003,
            name: "Appendix - Support Requests - VIP Raised Tickets - single period",
            path: subsection_root+"Appendix - Support Requests - VIP Raised Tickets - single period_WH02",
            period_type: 'single',            
            type: 'appendix'
        },         

        {
            order: 10.004,
            name: "Appendix - Trended Volumes for Reference - full period",
            path: subsection_root+"Appendix - Trended Volumes for Reference - full period_WH02",
            type: 'appendix'
        },            

        {
            order: 10.005,
            name: "Appendix - Incident - Security Incidents - single period",
            path: subsection_root+"Appendix - Incident - Security Incidents - single period_WH02",
            period_type: 'single',            
            type: 'appendix'
        }, 

        {
            order: 10.006,
            name: "Appendix - Incidents - Tail Extract - single period",
            path: subsection_root+"Appendix - Incidents - Tail Extract - single period_WH02",
            period_type: 'single',  
            type: 'appendix'
        }, 

        {
            order: 10.007,
            name: "Appendix - Incidents - Top 15 Category Trends - full period",
            path: subsection_root+"Appendix - Incidents - Top 15 Category Trends - full period_WH02",
            type: 'appendix'
        },           

        {
            order: 10.008,
            name: "Appendix - Changes - Status - single period",
            path: subsection_root+"Appendix - Changes - Status - single period_WH02",
            period_type: 'single',            
            type: 'appendix'
        },    


        //TRENDED VOLUMES FOR REFERENCE



        //--------------------------------------------------------TEMPLATE

        {
            order: 20.001,
            name: "Template - Executive Summary",
            path: template_root+"Template - Executive Summary",
            period_type: "",
            type: 'template'
        },  
        {
            order: 20.002,
            name: "Template - Continual Service Improvement",
            path: template_root+"Template - Continual Service Improvement",
            period_type: "",
            type: 'appendix template'
        },  

        {
            order: 20.002,
            name: "Template - Actions Register",
            path: template_root+"Template - Actions Register",
            period_type: "",
            type: 'appendix template'
        },  

        //--------------------------------------------------------NEW





        ]
    },    
    )

    let subsections = await databaseQueriesUtil.createData2(creation_list)



    creation_list = []
    creation_list.push(
    {
        model: "Parameter",
        params: [
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


        // {
        //     order: 0,
        //     name: "database",
        //     query: "SELECT 'snapshot' AS value UNION SELECT 'warehouse' AS value",
        //     in_report: 0,
        //     parameter_type: 'all',
        //     group: 'Dataset'
        // },        

        {
            order: 0.009,
            name: "Use_Snapshot",
            query: `SELECT 'Y' as value UNION ALL SELECT 'N' as value`,
            parameter_type: 'all',
            group: 'Dataset'
        },            
        {
            order: 0.01,
            name: "Aggregation_Type",
            query: `SELECT Selection as value FROM FNC_CustomDateAggregation(default, default)`,
            parameter_type: 'all',
            group: 'Dataset'
        },        
        {
            order: 0.1,
            name: "Client",
            query: 'SELECT dim_orgunit_cleaned AS value FROM DIMENSION_orgunit ORDER BY dim_orgunit_cleaned',
            parameter_type: 'all',
            group: 'Dataset'
        },
        {
            order: 0.11,
            name: "Filter",
            query: '',
            parameter_type: 'all',
            group: 'Dataset'
        },        
        // {
        //     order: 0.2,
        //     name: "source_table",
        //     query: "SELECT 'LF_'+REPLACE(dim_orgunit_cleaned,' ','') AS value FROM DIMENSION_orgunit ORDER BY dim_orgunit_cleaned",
        //     parameter_type: 'all',
        //     group: 'Dataset'
        // },
        // {
        //     order: 0.3,
        //     name: "ddi_filter",       
        //     query: "SELECT dim_orgunit_cleaned AS value FROM DIMENSION_orgunit ORDER BY dim_orgunit_cleaned",
        //     parameter_type: 'sla',
        //     group: 'Dataset'
        // },    



        {
            order: 1.0,
            name: "Date_Range",
            query: `SELECT Selection as name ,ID as value FROM PreSelected_DateRange_View`, //"SELECT type AS name ,value FROM [dbo].[daterange_view]",
            parameter_type: 'full',
            group: 'Date'
        },          
        {
            order: 1.2,
            name: "Date_Start",
            query: "",
            parameter_type: 'full',
            field_type: "date",
            group: 'Date'
        },  
        {
            order: 1.3,
            name: "Date_End",
            query: "",
            parameter_type: 'full',
            field_type: "date",            
            group: 'Date'
        },          


        {
            order: 1.4,
            name: "Date_Range_SP",
            query: `SELECT Selection as name ,ID as value FROM PreSelected_DateRange_View`, //"SELECT type AS name ,value FROM [dbo].[daterange_view]",
            parameter_type: 'single',
            group: 'Date'
        },          
        {
            order: 1.5,
            name: "Date_Start_SP",      
            query: "",
            parameter_type: 'single',
            field_type: "date",
            group: 'Date'
        },  
        {
            order: 1.6,
            name: "Date_End_SP",       
            query: "",
            parameter_type: 'single',
            field_type: "date",
            group: 'Date'
        },        



        // {
        //     order: 2.1,
        //     name: "core_hours_start",       
        //     query: 
        //     `
        //     DECLARE @startnum INT=0
        //     DECLARE @endnum INT=23
        //     ;
        //     WITH gen AS (
        //         SELECT @startnum AS value
        //         UNION ALL
        //         SELECT value+1 FROM gen WHERE value+1<=@endnum
        //     )
        //     SELECT * FROM gen
        //     option (maxrecursion 10000)          
        //     `,
        //     parameter_type: 'data',
        //     group: 'Time'
        // },        
        // {
        //     order: 2.2,
        //     name: "core_hours_end",       
        //     query: 
        //     `
        //     DECLARE @startnum INT=0
        //     DECLARE @endnum INT=23
        //     ;
        //     WITH gen AS (
        //         SELECT @startnum AS value
        //         UNION ALL
        //         SELECT value+1 FROM gen WHERE value+1<=@endnum
        //     )
        //     SELECT * FROM gen
        //     option (maxrecursion 10000)            
        //     `,
        //     parameter_type: 'data',
        //     group: 'Time'
        // },        


        // {
        //     order: 3.1,
        //     name: "customer_filter",       
        //     query: "",
        //     parameter_type: 'data',
        //     group: 'Sub-Filter'
        // },        
        // {
        //     order: 3.2,
        //     name: "third_party_filter",       
        //     query: "",
        //     parameter_type: 'data',
        //     group: 'Sub-Filter'
        // },    



        // {
        //     order: 4.0153,
        //     name: "telephony_sla_target",       
        //     query: "",
        //     parameter_type: 'data',
        //     group: 'SLA - Telephony'
        // },   

        // {
        //     order: 4.01902,
        //     name: "telephony_20second_target",       
        //     query: "",
        //     parameter_type: 'sla',
        //     group: 'SLA - Telephony'
        // },    
        // {
        //     order: 4.01903,
        //     name: "telephony_30second_target",       
        //     query: "",
        //     parameter_type: 'sla',
        //     group: 'SLA - Telephony'
        // },  
        // {
        //     order: 4.01904,
        //     name: "telephony_40second_target",       
        //     query: "",
        //     parameter_type: 'sla',
        //     group: 'SLA - Telephony'
        // },          
        

        // {
        //     order: 4.01905,
        //     name: "fcr_target",       
        //     query: "",
        //     parameter_type: 'sla',
        //     group: 'SLA - Incident'
        // },     
        // {
        //     order: 4.01906,
        //     name: "old_incidents_target",       
        //     query: "",
        //     parameter_type: 'sla',
        //     group: 'SLA - Incident'
        // },     
        // {
        //     order: 4.01907,
        //     name: "aged_tickets_days",
        //     query: "",
        //     parameter_type: 'sla',
        //     group: 'SLA - Incident'
        // },   
        // {
        //     order: 4.019071,
        //     name: "reopened_tickets_target",
        //     query: "",
        //     parameter_type: 'sla',
        //     group: 'SLA - Incident'
        // },  



        // {
        //     order: 4.01908,
        //     name: "p1_response_time",       
        //     query: "",
        //     parameter_type: 'sla',
        //     group: 'SLA - Incident Response'
        // },   
        // {
        //     order: 4.01909,
        //     name: "p2_response_time",       
        //     query: "",
        //     parameter_type: 'sla',
        //     group: 'SLA - Incident Response'
        // },   
        // {
        //     order: 4.01910,
        //     name: "p3_response_time",       
        //     query: "",
        //     parameter_type: 'sla',
        //     group: 'SLA - Incident Response'
        // },           
        // {
        //     order: 4.01911,
        //     name: "p1_response_target",       
        //     query: "",
        //     parameter_type: 'sla',
        //     group: 'SLA - Incident Response'
        // },   
        // {
        //     order: 4.01912,
        //     name: "p2_response_target",       
        //     query: "",
        //     parameter_type: 'sla',
        //     group: 'SLA - Incident Response'
        // },   
        // {
        //     order: 4.01913,
        //     name: "p3_response_target",       
        //     query: "",
        //     parameter_type: 'sla',
        //     group: 'SLA - Incident Response'
        // },           
        // {
        //     order: 4.019131,
        //     name: "combined_response_target",       
        //     query: "",
        //     parameter_type: 'sla',
        //     group: 'SLA - Incident Response'
        // },     

        // {
        //     order: 4.01914,
        //     name: "priority1_hours",       
        //     query: "",
        //     parameter_type: 'sla',
        //     group: 'SLA - Incident Resolution'
        // },   
        // {
        //     order: 4.01915,
        //     name: "priority2_hours",       
        //     query: "",
        //     parameter_type: 'sla',
        //     group: 'SLA - Incident Resolution'
        // },   
        // {
        //     order: 4.01916,
        //     name: "priority3_hours",       
        //     query: "",
        //     parameter_type: 'sla',
        //     group: 'SLA - Incident Resolution'
        // },           
        // {
        //     order: 4.01917,
        //     name: "priority1_target",       
        //     query: "",
        //     parameter_type: 'sla',
        //     group: 'SLA - Incident Resolution'
        // },   
        // {
        //     order: 4.01918,
        //     name: "priority2_target",       
        //     query: "",
        //     parameter_type: 'sla',
        //     group: 'SLA - Incident Resolution'
        // },   
        // {
        //     order: 4.01919,
        //     name: "priority3_target",       
        //     query: "",
        //     parameter_type: 'sla',
        //     group: 'SLA - Incident Resolution'
        // },         
        // {
        //     order: 4.01920,
        //     name: "P3toP5_resolution_target",       
        //     query: "",
        //     parameter_type: 'sla',
        //     group: 'SLA - Incident Resolution'
        // },      

        // {
        //     order: 4.01922,
        //     name: "combined_SLA_target",       
        //     query: "",
        //     parameter_type: 'sla',
        //     group: 'SLA - Incident Resolution'
        // },
 
        // {
        //     order: 4.01923,
        //     name: "successful_changes_target",       
        //     query: "",
        //     parameter_type: 'sla',
        //     group: 'SLA - Change'
        // },   


        // {
        //     order: 5.0,
        //     name: "selected_slas",       
        //     query: 
        //     `
        //     SELECT
        //     'Telephones answered within 20 seconds'AS name,
        //     'a' AS value
        //     UNION All
        //     SELECT
        //     'Telephones answered within 30 seconds'AS name,
        //     'o' AS value
        //     UNION All
        //     SELECT
        //     'Telephones answered within 40 seconds'AS name,
        //     'p' AS value
        //     UNION All
        //     SELECT
        //     'Telephone and LF Live FCR rate'AS name,
        //     'b' AS value
        //     UNION All
        //     SELECT
        //     'Availability of any of the Service Desk channels'AS name,
        //     'c' AS value
        //     UNION All
        //     SELECT
        //     'Priority 1 Incident Response'AS name,
        //     'd' AS value
        //     UNION All
        //     SELECT
        //     'Priority 2 Incident Response'AS name,
        //     'e' AS value
        //     UNION All
        //     SELECT
        //     'Priority 3 Incident Response'AS name,
        //     'f' AS value
        //     UNION All
        //     SELECT
        //     'Combined Incident Response'AS name,
        //     'g' AS value
        //     UNION All
        //     SELECT
        //     'Priority 1 Incident Resolution'AS name,
        //     'h' AS value
        //     UNION All
        //     SELECT
        //     'Priority 2 Incident Resolution'AS name,
        //     'i' AS value
        //     UNION All
        //     SELECT
        //     'Priority 3 Incident Resolution'AS name,
        //     'j' AS value
        //     UNION All
        //     SELECT
        //     'Combined Incident Resolution'AS name,
        //     'k' AS value
        //     UNION All
        //     SELECT
        //     'p3-p5 Incident Resolution'AS name,
        //     'n' AS value
        //     UNION All
        //     SELECT
        //     'Incidents older than 1 month'AS name,
        //     'l' AS value
        //     UNION All
        //     SELECT
        //     'Changes implemented successfully at first attempt'AS name,
        //     'm' AS value
        //     UNION All
        //     SELECT
        //     'Volume of Incidents Re-opened'AS name,
        //     'q' AS value
        //     UNION All
        //     SELECT
        //     'Priority 1 Incident Response (No Monitoring)'AS name,
        //     'r' AS value
        //     UNION All
        //     SELECT
        //     'Priority 2 Incident Response (No Monitoring)'AS name,
        //     's' AS value
        //     UNION All
        //     SELECT
        //     'Priority 1 Incident Resolution (No Monitoring)'AS name,
        //     't' AS value
        //     UNION All
        //     SELECT
        //     'Priority 2 Incident Resolution (No Monitoring)'AS name,
        //     'u' AS value
        //     UNION All
        //     SELECT
        //     'Combined Incident Resolution (No Monitoring)'AS name,
        //     'v' AS value
        //     UNION All
        //     SELECT
        //     'Incidents older than 1 month (No Monitoring)'AS name,
        //     'w' AS value
        //     UNION All
        //     SELECT
        //     'Incidents older than 1 month (No P4s)'AS name,
        //     'x' AS value            
        //     `,
        //     parameter_type: 'sla',
        //     group: 'SLA - Selected SLAs',
        //     field_type: "multiple"
        // },   





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
            ,owner: "thomas.cassady@littlefish.co.uk"
        },               
        // {
        //     name: "Fusion - Service Report"
        //     ,description: "A template for the regularly used SSRS Service Report"
        //     ,owner: "93e16e04-771c-4137-b169-748d2dc103c3"
        // },      
              
        ]
    },    
    )

    let reports = await databaseQueriesUtil.createData2(creation_list)

    //SERVICE REPORT
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
                name: "Knowledge",
                order: 6,
                reportId: reports[0].id
            },          
            {
                name: "Change",
                order: 7,
                reportId: reports[0].id
            },
            {
                name: "Continual Service Improvement (CSI)",
                order: 8,
                reportId: reports[0].id
            },              
            {
                name: "Service Review Meetings Actions Register",
                order: 9,
                reportId: reports[0].id
            },    

            //APPENDIX
            {
                name: "Appendix A - Positive CSAT Feedback",
                order: 10,
                reportId: reports[0].id
            },
            {
                name: "Appendix B - Positive NPS Feedback",
                order: 11,
                reportId: reports[0].id
            },                
            {
                name: "Appendix C - Trended Volumes for Reference",
                order: 12,
                reportId: reports[0].id
            },   
            {
                name: "Appendix D - Incident Tail Details",
                order: 13,
                reportId: reports[0].id
            },   
            {
                name: "Appendix E - VIP Support Requests",
                order: 14,
                reportId: reports[0].id
            },   
            {
                name: "Appendix F - RFCs Raised and Reviewed this period",
                order: 15,
                reportId: reports[0].id
            },   
            {
                name: "Appendix G - Top 15 Category Trends",
                order: 16,
                reportId: reports[0].id
            },   
            

        ]
    })
    
    let sections = await databaseQueriesUtil.createData2(creation_list)

    // //FUSION REPORT
    // creation_list = []
    // creation_list.push(
    // {
    //     model: "Section",
    //     params: [    
    //         {
    //             name: "Executive Summary",
    //             order: 1,
    //             reportId: reports[1].id
    //         },  
    //         {
    //             name: "Service Desk",
    //             order: 2,
    //             reportId: reports[1].id
    //         },   
    //         {
    //             name: "Incident Management",
    //             order: 3,
    //             reportId: reports[1].id
    //         },              
    //         {
    //             name: "Requests",
    //             order: 4,
    //             reportId: reports[1].id
    //         },        
    //         {
    //             name: "Problem Management",
    //             order: 5,
    //             reportId: reports[1].id
    //         },                  
    //         {
    //             name: "Service Review Meetings Actions Register",
    //             order: 6,
    //             reportId: reports[1].id
    //         },    
    //         {
    //             name: "Appendix A - Positive Customer Feedback",
    //             order: 7,
    //             reportId: reports[1].id
    //         },    
    //         {
    //             name: "Appendix B - Trended Volumes for Reference",
    //             order: 8,
    //             reportId: reports[1].id
    //         },   
    //         {
    //             name: "Appendix C - Category Trends - Within Top 15 Category Types",
    //             order: 9,
    //             reportId: reports[1].id
    //         },   
            

    //     ]
    // })
    
    // sections = await databaseQueriesUtil.createData2(creation_list)



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
            name: "Warehouse Cafcass Test",
            report_name: "Service Report",
            report_sub_name: "Cafcass", 
            email_to: "thomas.cassady@littlefish.co.uk",
            subject: "Service Report",
            body: "please find attached your copy of the service report",
            start_date: "2021-07-08",
            time: "16:02",     
            parameters: `
            {
                "Use_Snapshot": "N",
                "Aggregation_Type": "Month", 
                "Client": "Cafcass", 
                "Date_Range": "26",
                "Date_Start": "2000-01-01", 
                "Date_End": "2000-01-01",
                "Date_Range_SP": "14",
                "Date_Start_SP": "2000-01-01", 
                "Date_End_SP": "2000-01-01"

            }`,              
        },       


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

