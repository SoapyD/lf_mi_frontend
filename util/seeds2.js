const database = require('./database')
const Report = require("../models/report");
const FusionSection = require("../models/fusion");
const Section = require("../models/section");
const Subscription = require("../models/subscription");
const Frequency = require("../models/frequency");
const Parameter = require("../models/parameter");
const databaseController = require('../controllers/database');

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

    //////////////////////////////////////////////////////////////////////SECTIONS
	let se_1 =  Section.create ({
        path: ''
		,name: ''
		,description: ''
	})  

	let se_2 =  Section.create ({
        path: '/99 - Test Reports/Tom Dev/Service Report/'
		,name: 'front'
		,description: ''
	})   

	let se_3 =  Section.create ({
        path: '/99 - Test Reports/Tom Dev/Service Report/'
		,name: 'Support Requests - 13month by Source'
		,description: ''
	})    

	let se_4 =  Section.create ({
        path: '/99 - Test Reports/Tom Dev/Service Report/'
		,name: 'Support Requests - Incidents Opened and Resolved Per Month'
		,description: ''
	})    

	let se_5 =  Section.create ({
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

	databaseController.getReport(report_id)
	.then((report) => {

        //ADD FRONT PAGE
        databaseController.getSection(-1, name="front")
        .then((section) => {

            databaseController.getParameter(-1, name='company_filter')
            .then((parameter) => {
                FusionSection.create({
                    order: 1
                    ,join_from_id: parameter.id
                    ,join_from: 'parameter'                                                   
                    ,join_to_id: section.id
                    ,join_to: 'section'                                                 
                })                   
            })   

            databaseController.getParameter(-1, name='report_name')
            .then((parameter) => {
                FusionSection.create({
                    order: 1
                    ,join_from_id: parameter.id
                    ,join_from: 'parameter'                                                   
                    ,join_to_id: section.id
                    ,join_to: 'section'                                                 
                })                   
            })   

            FusionSection.create({
                order: 1
                ,join_from_id: section.id
                ,join_from: 'section'                                                   
                ,join_to_id: report_id
                ,join_to: 'report'    
            })            
        })        

        //ADD REPORT SECTION
        databaseController.getSection(-1, name='Support Requests - 13month by Source')
        .then((section) => {
  
            databaseController.getParameter(-1, name='company_filter')
            .then((parameter) => {
                FusionSection.create({
                    order: 1
                    ,join_from_id: parameter.id
                    ,join_from: 'parameter'                                                   
                    ,join_to_id: section.id
                    ,join_to: 'section'                                                 
                })                   
            })           
            
            databaseController.getParameter(-1, name='source_table')
            .then((parameter) => {
                FusionSection.create({
                    order: 1
                    ,join_from_id: parameter.id
                    ,join_from: 'parameter'                                                   
                    ,join_to_id: section.id
                    ,join_to: 'section'                                                 
                })                   
            })                            

            FusionSection.create({
                order: 2
                ,join_from_id: section.id
                ,join_from: 'section'                                                   
                ,join_to_id: report_id
                ,join_to: 'report'                                                 
            })                      
        }) 

        //ADD REPORT SECTION
        databaseController.getSection(-1, name='Support Requests - Incidents Opened and Resolved Per Month')
        .then((section) => {  

            databaseController.getParameter(-1, name='company_filter')
            .then((parameter) => {
                FusionSection.create({
                    order: 1
                    ,join_from_id: parameter.id
                    ,join_from: 'parameter'                                                   
                    ,join_to_id: section.id
                    ,join_to: 'section'                                                 
                })                   
            })          

            databaseController.getParameter(-1, name='source_table')
            .then((parameter) => {
                FusionSection.create({
                    order: 1
                    ,join_from_id: parameter.id
                    ,join_from: 'parameter'                                                   
                    ,join_to_id: section.id
                    ,join_to: 'section'                                                 
                })                   
            })                      
            
            FusionSection.create({
                order: 3
                ,join_from_id: section.id
                ,join_from: 'section'                                                   
                ,join_to_id: report_id
                ,join_to: 'report'                                                 
            })                      
        }) 

        //ADD REPORT SECTION
        databaseController.getSection(-1, name='Incidents - Open and Resolved per Month per Resolver Group')
        .then((section) => {  

            databaseController.getParameter(-1, name='company_filter')
            .then((parameter) => {
                FusionSection.create({
                    order: 1
                    ,join_from_id: parameter.id
                    ,join_from: 'parameter'                                                   
                    ,join_to_id: section.id
                    ,join_to: 'section'                                                 
                })                   
            })          

            databaseController.getParameter(-1, name='source_table')
            .then((parameter) => {
                FusionSection.create({
                    order: 1
                    ,join_from_id: parameter.id
                    ,join_from: 'parameter'                                                   
                    ,join_to_id: section.id
                    ,join_to: 'section'                                                 
                })                   
            })                      
            
            FusionSection.create({
                order: 4
                ,join_from_id: section.id
                ,join_from: 'section'                                                   
                ,join_to_id: report_id
                ,join_to: 'report'                                                 
            })                      
        }) 


        //CREATE SUBSCRIPTIONS
        databaseController.getFrequency(-1, name='Monthly')
        .then((frequency) => {
            Subscription.create({
                name: "Cafcass - Monthly",
                start_date: "2020-10-27",
                time: "16:01",     
                parameters: '{"report_name": "Service Report", "company_filter": "Cafcass", "source_table": "LF_Cafcass"}',       
                NODEReportId: report_id,                              
                NODEFrequencyId: frequency.id,
            })         
            
            // databaseController.setSubscriptionParameters(1)
            // .then((lists) => {
            //     console.log(lists)  
            // })         

        })         

        // databaseController.getFrequency(-1, name='Monthly')
        // .then((frequency) => {
        //     Subscription.create({
        //         name: "Signet - Monthly",
        //         start_date: "2020-10-27",
        //         time: "16:01",            
        //         NODEReportId: report_id,                              
        //         NODEFrequencyId: frequency[0].id,
        //     })            
        // })   


	})
 
}

exports.seed = async() => {

    databaseController.dropParameters();    
    databaseController.dropSubscriptions();
    databaseController.dropFrequencies();     
    databaseController.dropFusions();
    databaseController.dropSections();
    databaseController.dropReports();  

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