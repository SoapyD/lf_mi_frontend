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

        //TOTAL VOLUME FLOW DIAGRAM

        {
            order: 1.001,
            name: "Support Requests - Source per period",
            path_snapshot: "/99 - Test Reports/Service Report/Support Requests - Source per period_SNP",
            path_warehouse: "/99 - Test Reports/Service Report/Support Requests - Source per period_WH"
        },   

        {
            order: 1.002,
            name: "Support Requests - Location per period",
            path_snapshot: "/99 - Test Reports/Service Report/Support Requests - Location per period_SNP",
            path_warehouse: "/99 - Test Reports/Service Report/Support Requests - Location per period_WH"
        },   

        {
            order: 1.003,
            name: "Support Requests - Time of Day per period",
            path_snapshot: "/99 - Test Reports/Service Report/Support Requests - Time of Day per period_SNP",
            path_warehouse: "/99 - Test Reports/Service Report/Support Requests - Time of Day per period_WH"
        },   


        //INCIDENTS - TOP 5 Categories and Subcategories
        {
            order: 2.0001,
            name: "Incidents - Major Incident Review",
            path_snapshot: "/99 - Test Reports/Service Report/Incidents - Major Incident Review_SNP",
            path_warehouse: "/99 - Test Reports/Service Report/Incidents - Major Incident Review_WH",
            period_type: 'single'
        },    

        {
            order: 2.0012,
            name: "Incidents - FCR per period",
            path_snapshot: "/99 - Test Reports/Service Report/Incidents - FCR per period_SNP",
            path_warehouse: "/99 - Test Reports/Service Report/Incidents - FCR per period_WH"
        },    

        {
            order: 2.0013,
            name: "Incidents - Category Trends per period",
            path_snapshot: "/99 - Test Reports/Service Report/Incidents - Category Trends per period_SNP",
            path_warehouse: "/99 - Test Reports/Service Report/Incidents - Category Trends per period_SNP"
        },    

        {
            order: 2.002,
            name: "Incidents - Opened and Resolved per period",
            path_snapshot: "/99 - Test Reports/Service Report/Incidents - Opened and Resolved per period_SNP",
            path_warehouse: "/99 - Test Reports/Service Report/Incidents - Opened and Resolved per period_WH"
        },           
        {
            order: 2.003,
            name: "Incidents - Opened and Resolved per period per resolver group",
            path_snapshot: "/99 - Test Reports/Service Report/Incidents - Opened and Resolved per period per resolver group_SNP",
            path_warehouse: "/99 - Test Reports/Service Report/Incidents - Opened and Resolved per period per resolver group_WH"
        },            
        {
            order: 2.004,
            name: "Incidents - Priority per period",
            path_snapshot: "/99 - Test Reports/Service Report/Incidents - Priority per period_SNP",
            path_warehouse: "/99 - Test Reports/Service Report/Incidents - Priority per period_WH"
        },       


        //REQUESTS - top 5 category and subcategory


        {
            order: 2,
            name: "Problems - Open and Closed current period",
            path_snapshot: "/99 - Test Reports/Service Report/Problems - Open and Closed current period_SNP",
            path_warehouse: "/99 - Test Reports/Service Report/Problems - Open and Closed current period_WH",
            period_type: 'single'
        },       
        {
            order: 3.002,
            name: "Problems - Open and Closed per period",
            path_snapshot: "/99 - Test Reports/Service Report/Problems - Open and Closed per period_SNP",
            path_warehouse: "/99 - Test Reports/Service Report/Problems - Open and Closed per period_WH"
        }, 



        //CSAT - customer satisfaction measurements

        {
            order: 4.002,
            name: "CSAT - Service Feedback Summary",
            path_snapshot: "/99 - Test Reports/Service Report/CSAT - Service Feedback Summary_WH",
            path_warehouse: "/99 - Test Reports/Service Report/CSAT - Service Feedback Summary_WH",
            period_type: 'single'
        },  

        {
            order: 4.003,
            name: "CSAT - CSAT per period",
            path_snapshot: "/99 - Test Reports/Service Report/CSAT - CSAT per period_WH",
            path_warehouse: "/99 - Test Reports/Service Report/CSAT - CSAT per period_WH"
        },  

        {
            order: 5.001,
            name: "Telephony - Summary",
            path_snapshot: "/99 - Test Reports/Service Report/Telephony - Summary_WH",
            path_warehouse: "/99 - Test Reports/Service Report/Telephony - Summary_WH"
        },   


        {
            order: 10.001,
            name: "Appendix - CSAT - Positive Customer Feedback",
            path_snapshot: "/99 - Test Reports/Service Report/Appendix - CSAT - Positive Customer Feedback_SNP",
            path_warehouse: "/99 - Test Reports/Service Report/Appendix - CSAT - Positive Customer Feedback_WH",
            period_type: 'single',
            type: 'appendix'
        },             
        {
            order: 10.002,
            name: "Appendix - Category Trends Top 15",
            path_snapshot: "/99 - Test Reports/Service Report/Appendix - Category Trends Top 15_SNP",
            path_warehouse: "/99 - Test Reports/Service Report/Appendix - Category Trends Top 15_WH",
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
            in_report: 0
        },          
        {
            order: 0,
            name: "Section_Name",
            query: "",
            visible: 0
        },
        {
            order: 0,
            name: "Subsection_Name",
            query: "",
            visible: 0
        },            
        {
            order: 0,
            name: "Add_Analysis_Box",
            query: "",
            visible: 0
        },   

        {
            order: 2,
            name: "company_filter",
            query: 'SELECT dim_orgunit_cleaned AS value FROM DIMENSION_orgunit ORDER BY dim_orgunit_cleaned'
        },
        {
            order: 2.1,
            name: "source_table",
            query: ""
        },

        {
            order: 0.012,
            name: "period_type",
            query: "SELECT type AS name ,value FROM [dbo].[daterange_view]"
        },          
        {
            order: 0.0121,
            name: "date_start",
            query: ""
        },  
        {
            order: 0.0122,
            name: "date_end",
            query: ""
        },          


        {
            order: 0.013,
            name: "period_type_sp",
            query: "SELECT type AS name ,value FROM [dbo].[daterange_view]"
        },          
        {
            order: 0.0131,
            name: "date_start_sp",      
            query: ""
        },  
        {
            order: 0.0132,
            name: "date_end_sp",       
            query: ""
        },        


        // {
        //     order: 5,
        //     name: "aged_ticket_days",
        //     query: ""
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

                "aged_ticket_days": "30"
            }`,              
        },       

        // {
        //     reportId: reports[0].id,
        //     frequencyId: frequencies[0].id,
        //     name: "Warehouse Fusion Test2",
        //     email_to: "thomas.cassady@littlefish.co.uk",
        //     subject: "Test Service Report",
        //     body: "please find attached your copy of the service report",
        //     start_date: "2020-10-27",
        //     time: "16:01",     
        //     parameters: `
        //     {
        //         "database": "warehouse", 
        //         "report_name": "Service Report", 
        //         "company_filter": "Fusion Lifestyle", 
        //         "source_table": "LF_FusionLifestyle", 
        //         "period_type": "8",
        //         "date_start": "01/01/2000", 
        //         "date_end": "01/01/2000",
        //         "period_type_sp": "1",
        //         "date_start_sp": "01/01/2000", 
        //         "date_end_sp": "01/01/2000",

        //         "aged_ticket_days": "30"
        //     }`,              
        // },  

        // {
        //     reportId: reports[0].id,
        //     frequencyId: frequencies[0].id,
        //     name: "Warehouse Fusion Test2",
        //     email_to: "thomas.cassady@littlefish.co.uk",
        //     subject: "Test Service Report",
        //     body: "please find attached your copy of the service report",
        //     start_date: "2020-10-27",
        //     time: "16:01",     
        //     parameters: `
        //     {
        //         "database": "warehouse", 
        //         "report_name": "Service Report", 
        //         "company_filter": "Fusion Lifestyle", 
        //         "source_table": "LF_FusionLifestyle", 
        //         "period_type": "8",
        //         "date_start": "01/01/2000", 
        //         "date_end": "01/01/2000",
        //         "period_type_sp": "1",
        //         "date_start_sp": "01/01/2000", 
        //         "date_end_sp": "01/01/2000",

        //         "aged_ticket_days": "30"
        //     }`,              
        // },  

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

