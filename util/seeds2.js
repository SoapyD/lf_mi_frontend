const database = require('./database')
const Report = require("../models/report");
const FusionSubSection = require("../models/fusion");
const SubSection = require("../models/subsection");
const Subscription = require("../models/subscription");
const Frequency = require("../models/frequency");
const Parameter = require("../models/parameter");
const databaseQueriesUtil = require('../util/database_queries');

async function populate(){


    //////////////////////////////////////////////////////////////////////FREQUENCIES
	let fr_1 =  Frequency.create ({
		name: 'Monthly'
        ,description: 'Report runs on the same date every month'
        ,order: 1.01
    })       
    
	let fr_2 =  Frequency.create ({
		name: 'Weekly'
        ,description: 'Report runs on the same date every week'
        ,order: 2.00        
    })       

	let fr_3 =  Frequency.create ({
		name: 'Daily'
        ,description: 'Report runs on the same date every day'
        ,order: 3.00        
    })    

	let fr_4 =  Frequency.create ({
		name: 'Bi-Weekly'
        ,description: 'Report runs on the same date every 2 weeks'
        ,order: 2.10        
    })    

    //////////////////////////////////////////////////////////////////////PARAMETERS

	let pr_1 =  Parameter.create ({
		name: 'report_name'
		,query: ''
	})  

    let pr_2 =  Parameter.create ({
		name: 'company_filter'
		,query: 'SELECT dim_orgunit_cleaned AS value FROM DIMENSION_orgunit ORDER BY dim_orgunit_cleaned'
	})  

	let pr_3 =  Parameter.create ({
		name: 'source_table'
		,query: ''
	})  


	// await Parameter.create ({
	// 	name: 'User'
	// 	,query: 'SELECT dim_User_cleaned AS value FROM DIMENSION_user ORDER BY dim_User_cleaned'
	// })  

    //////////////////////////////////////////////////////////////////////SUB SECTIONS
	let se_1 =  SubSection.create ({
        path: ''
		,name: ''
		,description: ''
	})  

	let se_2 =  SubSection.create ({
        path: '/99 - Test Reports/Tom Dev/Service Report/'
		,name: 'front'
		,description: ''
	})   

	let se_3 =  SubSection.create ({
        path: '/99 - Test Reports/Tom Dev/Service Report/'
		,name: 'Support Requests - 13month by Source'
		,description: ''
	})    

	let se_4 =  SubSection.create ({
        path: '/99 - Test Reports/Tom Dev/Service Report/'
		,name: 'Support Requests - Incidents Opened and Resolved Per Month'
		,description: ''
	})    

	let se_5 =  SubSection.create ({
        path: '/99 - Test Reports/Tom Dev/Service Report/'
		,name: 'Incidents - Open and Resolved per Month per Resolver Group'
		,description: ''
	})    


    //////////////////////////////////////////////////////////////////////REPORTS    
	let re_1 =  Report.create ({
		name: 'Service Report'
		,description: 'The Standard 13 Month Service Report'
    })    

    return Promise.all([
        fr_1, fr_2, fr_3, fr_4,
        pr_3, pr_3, pr_3,
        se_1, se_2, se_3, se_4, se_5,
        re_1
    ])
}

async function fuse() {

    let report_id = 1;

	databaseQueriesUtil.getReport(report_id)
	.then((report) => {

        //ADD FRONT PAGE
        // databaseQueriesUtil.getSubSection(-1, name="front")
        // .then((subsection) => {

        //     FusionSubSection.create({
        //         order: 1
        //         ,join_from_id: subsection.id
        //         ,join_from: 'subsection'                                                   
        //         ,join_to_id: report_id
        //         ,join_to: 'report'    
        //     })            
        // })     


        
        //ADD FRONT PAGE
        databaseQueriesUtil.getSubSection(-1, name="front")
        .then((subsection) => {

            databaseQueriesUtil.getParameter(-1, name='company_filter')
            .then((parameter) => {
                FusionSubSection.create({
                    order: 1
                    ,join_from_id: parameter.id
                    ,join_from: 'Parameter'                                                   
                    ,join_to_id: subsection.id
                    ,join_to: 'SubSection'                                                 
                })                   
            })   

            databaseQueriesUtil.getParameter(-1, name='report_name')
            .then((parameter) => {
                FusionSubSection.create({
                    order: 1
                    ,join_from_id: parameter.id
                    ,join_from: 'Parameter'                                                   
                    ,join_to_id: subsection.id
                    ,join_to: 'SubSection'                                                 
                })                   
            })   

            FusionSubSection.create({
                order: 1
                ,join_from_id: subsection.id
                ,join_from: 'SubSection'                                                   
                ,join_to_id: report_id
                ,join_to: 'Report'    
            })            
        })        

        //ADD REPORT SECTION
        databaseQueriesUtil.getSubSection(-1, name='Support Requests - 13month by Source')
        .then((subsection) => {
  
            databaseQueriesUtil.getParameter(-1, name='company_filter')
            .then((parameter) => {
                FusionSubSection.create({
                    order: 1
                    ,join_from_id: parameter.id
                    ,join_from: 'Parameter'                                                   
                    ,join_to_id: subsection.id
                    ,join_to: 'SubSection'                                                 
                })                   
            })           
            
            databaseQueriesUtil.getParameter(-1, name='source_table')
            .then((parameter) => {
                FusionSubSection.create({
                    order: 1
                    ,join_from_id: parameter.id
                    ,join_from: 'Parameter'                                                   
                    ,join_to_id: subsection.id
                    ,join_to: 'SubSection'                                                 
                })                   
            })                            

            FusionSubSection.create({
                order: 2
                ,string_value: "Support Requests by Source"                
                ,join_from_id: subsection.id
                ,join_from: 'SubSection'                                                   
                ,join_to_id: report_id
                ,join_to: 'Report'                                                 
            })
              
            // FusionSubSection.create({
            //     order: 2
            //     ,string_value: "Support Requests by Source"                
            //     ,join_from_id: subsection.id
            //     ,join_from: 'SubSection'                                                   
            //     ,join_to_id: subsection.id
            //     ,join_to: 'SubSection'                                                 
            // })            

        }) 
/*
        //ADD REPORT SubSECTION
        databaseQueriesUtil.getSubSection(-1, name='Support Requests - Incidents Opened and Resolved Per Month')
        .then((subsection) => {  

            databaseQueriesUtil.getParameter(-1, name='company_filter')
            .then((parameter) => {
                FusionSubSection.create({
                    order: 1
                    ,join_from_id: parameter.id
                    ,join_from: 'Parameter'                                                   
                    ,join_to_id: subsection.id
                    ,join_to: 'SubSection'                                                 
                })                   
            })          

            databaseQueriesUtil.getParameter(-1, name='source_table')
            .then((parameter) => {
                FusionSubSection.create({
                    order: 1
                    ,join_from_id: parameter.id
                    ,join_from: 'Parameter'                                                   
                    ,join_to_id: subsection.id
                    ,join_to: 'SubSection'                                                 
                })                   
            })                      
            
            FusionSubSection.create({
                order: 3
                ,join_from_id: subsection.id
                ,join_from: 'SubSection'                                                   
                ,join_to_id: report_id
                ,join_to: 'Report'                                                 
            })                      
        }) 
        */


        //CREATE SUBSCRIPTIONS
        databaseQueriesUtil.getFrequency(-1, name='Monthly')
        .then((frequency) => {
            Subscription.create({
                name: "Cafcass - Monthly",
                email_to: "thomas.cassady@littlefish.co.uk",
                body: "please find attached your copy of the serice report",
                start_date: "2020-10-27",
                time: "16:01",     
                parameters: '{"report_name": "Service Report", "company_filter": "Cafcass", "source_table": "LF_Cafcass"}',       
                NODEReportId: report_id,                              
                NODEFrequencyId: frequency.id,
            })             

        })         

	})
 
}

exports.seed = async() => {

    await databaseQueriesUtil.dropParameters();    
    await databaseQueriesUtil.dropSubscriptions();
    await databaseQueriesUtil.dropFrequencies();     
    await databaseQueriesUtil.dropFusions();
    await databaseQueriesUtil.dropSubSections();
    await databaseQueriesUtil.dropReports();  

    await database.sequelize.sync()
    .then(result => {
        populate()
        .then(result=>{
            fuse();
        })
    })    

    
    
    console.log("Seeding Finished")
}


// module.exports = seed