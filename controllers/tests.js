const { SectionSubSection } = require("../models");
const models = require("../models");
const database = require('../util/database')
// const databaseQueriesUtil = require('../util/database_queries');


exports.deleteTests = async(req, res) => {

    await exports.reset()

    // res.send("deletion complete")
}


exports.createTests = async(req,res) => { //, middleware.isLoggedIn

    // 
    await exports.deleteTests()

    await database.sequelize.sync()

    let creation_list = [];


    creation_list = []
    creation_list.push(
    {
        model: "SubSection",
        params: [
        {
            name: "sub section 1",
            path: "/test/test"
        },  
        {
            name: "sub section 2",
            path: "/test/test"
        },  
        {
            name: "sub section 3",
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
            NODEREPORTReportId: reports[0].id
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
            NODEREPORTsectionId: sections[0].id,
            NODEREPORTsubsectionId: subsections[0].id
        },   
        {
            order: 2,
            NODEREPORTsectionId: sections[0].id,
            NODEREPORTsubsectionId: subsections[1].id
        },   
        {
            order: 3,
            NODEREPORTsectionId: sections[0].id,
            NODEREPORTsubsectionId: subsections[2].id
        },                            
        ]
    },    
    )

    let sectionsubsections = await exports.createData(creation_list)

    let full_report = await exports.findData()

    res.send("creation complete")
};

exports.reset = async() => {
    await models.SectionSubSection.drop()
    await models.SubSection.drop()
    await models.Section.drop()
    await models.Report.drop()    

    
}


exports.createData = async(creation_list) => {

    let promises = [];

    creation_list.forEach((list) => {
        list.params.forEach((item) => {
            promises.push(models[list.model].create(item))
        })
    })

    return Promise.all(promises)
}

exports.findData = async() => {

    return models.Report.findOne({
        where: {
            name: 'report 1'
        }
        ,include: [
        {
            model: models.Section, 
            as: "sections",
            include: [
                {
                    model: models.SubSection, 
                    as: "subsections",
                    through: {
                        model: SectionSubSection,
                        as: "sectionsubsections"
                    }
                }
            ]
        }      
        ]
    })    
}



exports.oldTest = () => {
	models.Report.create ({
		name: 'Test Report'
        ,description: 'A test report'
        ,owner: "93e16e04-771c-4137-b169-748d2dc103c3"
    })   
    .then((report) => {
        models.Section.create({
            name: "test section"
            ,order: 1
            ,NODEREPORTReportId: report.id
        })
        .then((section) => {
            
            models.Report.findOne({
                where: {
                    name: 'Test Report'
                }
                ,include: [{
                    model: models.Section, as: "sections"
                }]
            })
            .then((report) => {
                res.send("test")
            })
        })
    })    
}