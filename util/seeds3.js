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
        {
            name: "front",
            path: "/99 - Test Reports/Tom Dev/Service Report/",
        },  
        {
            name: "Support Requests - 13month by Source",
            path: "/99 - Test Reports/Tom Dev/Service Report/"
        },  
        {
            name: "Support Requests - Incidents Opened and Resolved Per Month",
            path: "/99 - Test Reports/Tom Dev/Service Report/"
        },     
        {
            name: "Incidents - Open and Resolved per Month per Resolver Group",
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
        {
            name: "report_name",
            query: ""
        },    
        {
            name: "company_filter",
            query: 'SELECT dim_orgunit_cleaned AS value FROM DIMENSION_orgunit ORDER BY dim_orgunit_cleaned'
        },
        {
            name: "source_table",
            query: ""
        },      
        ]
    }) 

    let parameters = await databaseQueriesUtil.createData2(creation_list)


    creation_list = []
    creation_list.push(
    {
        model: "SubSectionParameter",
        params: [
        {
            subsectionId: subsections[0].id, //FRONT
            parameterId: parameters[0].id //REPORT NAME
        },   
        {
            subsectionId: subsections[0].id, //FRONT
            parameterId: parameters[1].id //COMPANY NAME
        },             
        
        {
            subsectionId: subsections[1].id, //
            parameterId: parameters[1].id //COMPANY NAME
        },   
        {
            subsectionId: subsections[1].id, //
            parameterId: parameters[2].id //SOURCE NAME
        },             

        {
            subsectionId: subsections[2].id, //
            parameterId: parameters[1].id //COMPANY NAME
        },   
        {
            subsectionId: subsections[2].id, //
            parameterId: parameters[2].id //SOURCE NAME
        },    

        {
            subsectionId: subsections[3].id, //
            parameterId: parameters[1].id //COMPANY NAME
        },   
        {
            subsectionId: subsections[3].id, //
            parameterId: parameters[2].id //SOURCE NAME
        },            

        ]
    },    
    )

    let subsectionparameters = await databaseQueriesUtil.createData2(creation_list)



    creation_list = []
    creation_list.push(
    {
        model: "Report",
        params: [
        {
            name: "Service Report"
            ,owner: "93e16e04-771c-4137-b169-748d2dc103c3"
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
                name: "Front",
                order: 1,
                reportId: reports[0].id
            },      
            {
                name: "Support Requests",
                order: 2,
                reportId: reports[0].id
            },       
            {
                name: "Incidents",
                order: 3,
                reportId: reports[0].id
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
            subsectionId: subsections[3].id
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
            name: "Cafcass Test",
            email_to: "thomas.cassady@littlefish.co.uk",
            subject: "Test Service Report",
            body: "please find attached your copy of the service report",
            start_date: "2020-10-27",
            time: "16:01",     
            parameters: '{"report_name": "Service Report", "company_filter": "Cafcass", "source_table": "LF_Cafcass"}',              
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

