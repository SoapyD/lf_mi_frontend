const { SectionSubSection } = require("../models");
const models = require("../models");
const database = require('../util/database')


exports.deleteTests = async(req, res) => {

    await exports.reset()

    res.send("deletion complete")
}

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
        model: "Parameter",
        params: [
        {
            name: "company_filter",
            query: 'SELECT dim_orgunit_cleaned AS value FROM DIMENSION_orgunit ORDER BY dim_orgunit_cleaned'
        },
        {
            name: "source",
            query: ""
        },        
        ]
    }) 

    let parameters = await exports.createData(creation_list)


    creation_list = []
    creation_list.push(
    {
        model: "SubSection",
        params: [
        {
            name: "sub section 1",
            path: "/test/test",
        },  
        {
            name: "sub section 2",
            path: "/test/test"
        },  
        {
            name: "sub section 3",
            path: "/test/test"
        },     
        {
            name: "sub section 4",
            path: "/test/test"
        },                                     
        ]
    },    
    )

    let subsections = await exports.createData(creation_list)


    creation_list = []
    creation_list.push(
    {
        model: "Report",
        params: [
        {
            name: "report 1"
            ,owner: "93e16e04-771c-4137-b169-748d2dc103c3"
        },            
        ]
    },    
    )

    let reports = await exports.createData(creation_list)

    creation_list = []
    creation_list.push(
        {
            model: "Section",
            params: [
                {
                    name: "section 1",
                    order: 1,
                    reportId: reports[0].id
                },            
            ]
        },    
        )
    

    let sections = await exports.createData(creation_list)


    creation_list = []
    creation_list.push(
    {
        model: "SectionSubSection",
        params: [
        {
            order: 1,
            name: "section renamed",
            sectionId: sections[0].id,
            subsectionId: subsections[0].id
        },   
        {
            order: 2,
            name: "",
            sectionId: sections[0].id,
            subsectionId: subsections[1].id
        },   
        // {
        //     order: 3,
        //     name: "section INSERTION",
        //     sectionId: sections[0].id,
        //     subsectionId: subsections[3].id
        // },           
        // {
        //     order: 4,
        //     sectionId: sections[0].id,
        //     subsectionId: subsections[2].id
        // },                            
        ]
    },    
    )

    let sectionsubsections = await exports.createData(creation_list)


    creation_list = []
    creation_list.push(
    {
        model: "SubSectionParameter",
        params: [
        {
            parameterId: sections[0].id,
            subsectionId: subsections[0].id
        },   
        {
            parameterId: sections[0].id,
            subsectionId: subsections[1].id
        },   
        {
            parameterId: sections[0].id,
            subsectionId: subsections[2].id
        },                            
        ]
    },    
    )

    let subsectionparameters = await exports.createData(creation_list)




    creation_list = []
    creation_list.push(
    {
        model: "Frequency",
        params: [
        {
            name: "Freq 1"
        },                              
        ]
    },    
    )

    let frequencies = await exports.createData(creation_list)



    creation_list = []
    creation_list.push(
    {
        model: "Subscription",
        params: [
        {
            reportId: reports[0].id,
            frequencyId: frequencies[0].id,
            name: "Cafcass Test"
        },                              
        ]
    },    
    )

    let subscriptions = await exports.createData(creation_list)


    creation_list = []
    creation_list.push(
    {
        model: "SubscriptionActivity",
        params: [
        {
            running: 2
            ,subscriptionId: subscriptions[0].id,
        },                              
        ]
    },    
    )

    let subscriptionActivities = await exports.createData(creation_list)



    let findlist = []

    findlist.push({
        model: "Report",
        search_type: "findOne",
        params: [
            {
                where: {
                    id: 1
                },
                include: exports.searchType['Full Report'].include
            }
        ]
    })


    let full_report = await exports.findData(findlist)   
    console.log("test complete")
    
    }    
    catch(err){
        console.log(err)

    }

}


exports.createTests = async(req,res) => { //, middleware.isLoggedIn

    await exports.create();
    
    res.send("creation complete")    
};




exports.createData = async(creation_list) => {

    let promises = [];

    creation_list.forEach((list) => {
        list.params.forEach((item) => {
            promises.push(models[list.model].create(item))
        })
    })

    return Promise.all(promises)
}

exports.searchType = {

    "Full Report": {
        include: [
            {
                model: models.Section, 
                as: "sections",
                include: [
                    {
                        model: models.SubSection, 
                        as: "subsections",
                        through: {
                            model: models.SectionSubSection,
                            as: "sectionsubsections"
                        },
                        include: [
                            {
                                model: models.Parameter, 
                                as: "parameters",
                                through: {
                                    model: models.SubSectionParameter,
                                    as: "subsectionparameters"
                                }
                            }
                        ]
                    }
                ]
            },
            {
                model: models.Subscription, 
                as: "subscriptions",             
                include: [
                    {
                        model: models.Frequency, 
                        as: "frequency"
                    }
                ]
            },                   
        ]        
    }
}


exports.findData = async(find_list) => {

    let promises = [];

    find_list.forEach((list) => {
        list.params.forEach((item) => {
            promises.push(models[list.model][list.search_type](item))
        })
    })

    return Promise.all(promises) 
 
}
