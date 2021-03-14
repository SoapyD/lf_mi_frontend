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
        // {
        //     order: 0,
        //     name: "front",
        //     path: "/99 - Test Reports/Tom Dev/Service Report/",
        // },  
        {
            order: 1,
            name: "Support Requests - Source per period",
            path: "/99 - Test Reports/Tom Dev/Service Report/"
        },   
        {
            order: 2,
            name: "Incidents - Opened and Resolved per period",
            path: "/99 - Test Reports/Tom Dev/Service Report/"
        },    
        {
            order: 3,
            name: "Incidents - Opened and Resolved per period per resolver group",
            path: "/99 - Test Reports/Tom Dev/Service Report/"
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
            order: 0.01,
            name: "Database",
            query: "SELECT 1 AS value, 'Snapshot' AS name UNION SELECT 2 AS value, 'Warehouse' AS name"
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
            order: 5,
            name: "aged_ticket_days",
            query: ""
        },    


        ]
    }) 

    let parameters = await databaseQueriesUtil.createData2(creation_list)


    creation_list = []
    creation_list.push(
    {
        model: "SubSectionParameter",
        params: []
    },    
    )

    parameters.forEach((parameter) => {
        subsections.forEach((subsection) => {

            if(parameter.order < 5){
                creation_list[0].params.push({
                    subsectionId: subsection.id,
                    parameterId: parameter.id
                })
            }
        })

    })

    let find_list = []
    find_list.push(
    {
        model: "SubSection",
        search_type: "findOne",
        params: [{
            where: {
                name: "Incidents - Opened and Resolved per period per resolver group",
            }		
        }]
    }) 
    let found_subsection = await databaseQueriesUtil.findData(find_list)


    creation_list[0].params.push({
        subsectionId: found_subsection[0].id,
        parameterId: 10
    })

    let subsectionparameters = await databaseQueriesUtil.createData2(creation_list)



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
        {
            name: "Service Report - Not Owned"
            ,description: "A copy of the Service Report not owned by the Admin to show what uneditable reports will look and act like"
            ,owner: ""
        },                 
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
                name: "Support Requests",
                order: 1,
                reportId: reports[0].id
            },       
            {
                name: "Incidents",
                order: 2,
                reportId: reports[0].id
            },          

            {
                name: "Support Requests",
                order: 1,
                reportId: reports[1].id
            },       
                                          
        ]
    })
    
    let sections = await databaseQueriesUtil.createData2(creation_list)



    creation_list = []
    creation_list.push(
    {
        model: "SectionSubSection",
        params: [

        {
            order: 1,
            name: "",
            sectionId: sections[0].id,
            subsectionId: subsections[0].id
        },         
        {
            order: 1,
            name: "",
            sectionId: sections[1].id,
            subsectionId: subsections[1].id
        },     
        {
            order: 2,
            name: "",
            sectionId: sections[1].id,
            subsectionId: subsections[2].id
        },     

        {
            order: 1,
            name: "",
            sectionId: sections[2].id,
            subsectionId: subsections[0].id
        },         
      

        ]
    },    
    )

    let sectionsubsections = await databaseQueriesUtil.createData2(creation_list)





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
            name: "Snapshot Cafcass Test",
            email_to: "thomas.cassady@littlefish.co.uk",
            subject: "Test Service Report",
            body: "please find attached your copy of the service report",
            start_date: "2020-10-27",
            time: "16:01",     
            parameters: `
            {
                "Database": 1, 
                "report_name": "Service Report", 
                "company_filter": "Cafcass", 
                "source_table": "LF_Cafcass", 
                "period_type": "8",
                "date_start": "01/01/2000", 
                "date_end": "01/01/2000",
                "aged_ticket_days": "30"
            }`,              
        },       
        {
            reportId: reports[0].id,
            frequencyId: frequencies[0].id,
            name: "Warehouse Cafcass Test",
            email_to: "thomas.cassady@littlefish.co.uk",
            subject: "Test Service Report",
            body: "please find attached your copy of the service report",
            start_date: "2020-10-27",
            time: "16:01",     
            parameters: `
            {
                "Database": 2, 
                "report_name": "Service Report", 
                "company_filter": "Cafcass", 
                "source_table": "LF_Cafcass", 
                "period_type": "8",
                "date_start": "01/01/2000", 
                "date_end": "01/01/2000",
                "aged_ticket_days": "30"
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

