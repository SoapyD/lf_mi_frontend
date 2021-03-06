// const Report = require("../models/report");
// const Subscription = require("../models/subscription");
const databaseQueriesUtil = require('../util/database_queries2');
const functionsUtil = require('../util/functions');
// const errorController = require('../controllers/error');
// const ssrsUtil = require('../util/ssrs2');

exports.getSubscriptions = async(req,res) => { //, middleware.isLoggedIn

	let id = req.params.reportid;

    try{
		let find_list = []
		find_list.push(
		{
			model: "Report",
			search_type: "findOne",
			params: [{
				where: {
					id: id,
				},
				include: databaseQueriesUtil.searchType['Full Report'].include			
			}]
		}) 

		//GET ALL REPORT DATA
		let reports = await databaseQueriesUtil.findData(find_list)
		let subscriptions = []
		if (reports[0].subscriptions)
		{
			subscriptions = reports[0].subscriptions
		}

		res.render("subscriptions/index", {report:reports[0], subscriptions:subscriptions});
    }
    catch(err){
        console.log(err)
        req.flash("error", "There was an error trying to get report subscriptions");
        res.redirect("/reports/")        
    }

};

exports.getFormCreateSubscription = async(req,res) => {

	let id = req.params.reportid;

    try{
		let find_list = []
		find_list.push(
		{
			model: "Report",
			search_type: "findOne",
			params: [{
				where: {
					id: id,
				},
				include: databaseQueriesUtil.searchType['Full Report'].include			
			}]
		}) 

		//GET ALL REPORT DATA
		let reports = await databaseQueriesUtil.findData(find_list)
		let report = reports[0]

		find_list = []
		find_list.push(
		{
			model: "Frequency",
			search_type: "findAll"
		}) 

		let parameter_ids = []
		if (report.sections){
			report.sections.forEach((section) => {
				if (section.subsections){
					section.subsections.forEach((subsection) => {

						if (subsection.parameters){
							subsection.parameters.forEach((parameter) => {
								parameter_ids.push(parameter.id)
							})
						}							

					})
				}				
			})
		}

		parameter_ids = parameter_ids.filter(functionsUtil.onlyUnique);

		find_list = []
		find_list.push(
		{
			model: "Parameter",
			search_type: "findOne",
			params: [{
				where: {
					id: parameter_ids,
				}		
			}]
		}) 

		//GET ALL REPORT DATA
		let parameters = await databaseQueriesUtil.findData(find_list)

		let frequencies = await databaseQueriesUtil.findData(find_list)		

		// res.render("subscriptions/index", {report:reports[0], subscriptions:subscriptions});
		res.render("subscriptions/new", {report:report, frequencies:frequencies, parameter_set:parameters});
    }
    catch(err){
        console.log(err)
        req.flash("error", "There was an error trying to load new subscription form");
        res.redirect("/reports/"+id+"/subscriptions")        
    }

	// databaseQueriesUtil.getReport(req.params.reportid)
	// .then((report) => {

	// 	databaseQueriesUtil.getAllFrequencies()
	// 	.then((frequencies) => {		
	// 		databaseQueriesUtil.getSubscriptionParameters(req.params.reportid)
	// 		.then((parameter_set) => {					
	// 			res.render("subscriptions/new", {report:report, frequencies:frequencies, parameter_set:parameter_set});
	// 		})
	// 		.catch(err => {
	// 			errorController.get404()
	// 		})				
	// 	})
	// 	.catch(err => {
	// 		errorController.get404()
	// 	})	
	// })    	
	// .catch(err => {
	// 	errorController.get404()
	// })	
};

exports.createSubscription = async(req,res) => { //, middleware.isLoggedIn
	
	
	// COMBINE THE PARAMETERS TOGETHER INTO A SINGLE STRING, WHICH CAN BE CONVERTED BACK TO AN OBJECT WHEN NEEDED	
	// let parameters = "{"
	// req.body.parameters.forEach((parameter, index)=> {
	// 	if (index > 0){
	// 		parameters += ", "
	// 	}
	// 	parameters += parameter
	// })

	// req.body.input_parameters.forEach((input_parameter, index)=> {
	// 	if (index > 0 || parameters !== ""){
	// 		parameters += ", "
	// 	}
	// 	parameters += '"'+req.body.input_parameter_names[index] +'" : "'+ input_parameter+'"'
	// })

	// parameters += "}"

	// Subscription.create ({
	// 	name: req.body.name
	// 	,email_to: req.body.email_to
	// 	,subject: req.body.subject
	// 	,body: req.body.body			
	// 	,start_date: req.body.start_date
	// 	,time: req.body.time
	// 	,parameters: parameters 		
	// 	,NODEReportId: req.params.reportid
	// 	,NODEFrequencyId: req.body.frequency
	// 	// ,author: author
	// })
	// .then(subscription => {
	// 	// console.log(subscription);
		
	// 	res.redirect("/reports/"+req.params.reportid+"/subscriptions");
	// })
	// .catch(err => {
	// 	errorController.get404()
	// })	

};


exports.getEditSubscription = async(req,res) => { //, middleware.isCampGroundOwnership

	// databaseQueriesUtil.getReport(req.params.reportid)
	// .then((report) => {
	// 	databaseQueriesUtil.getSubscription(req.params.subscriptionid)
	// 	.then((subscription) => {

	// 		// let frequencies = databaseQueriesUtil.getAllFrequencies();
	// 		databaseQueriesUtil.getAllFrequencies()
	// 		.then((frequencies) => {
	// 			databaseQueriesUtil.getSubscriptionParameters(req.params.reportid)
	// 			.then((parameter_set) => {		
	// 				let parameter_obj = JSON.parse(subscription.parameters);	

	// 				res.render("subscriptions/edit", 
	// 				{report:report, subscription:subscription, frequencies:frequencies, parameter_set:parameter_set, parameter_obj: parameter_obj});
	// 			})
	// 			.catch(err => {
	// 				errorController.get404()
	// 			})					
	// 		})
	// 		.catch(err => {
	// 			errorController.get404()
	// 		})				
	// 	})   
	// 	.catch(err => {
	// 		errorController.get404()
	// 	})			
	// }) 
	// .catch(err => {
	// 	errorController.get404()
	// })		

};


exports.updateSubscription = async(req,res) => { //, middleware.isCampGroundOwnership
	
	// databaseQueriesUtil.getSubscription(req.params.subscriptionid)
	// .then((subscription) => {

	// 	// COMBINE THE PARAMETERS TOGETHER INTO A SINGLE STRING, WHICH CAN BE CONVERTED BACK TO AN OBJECT WHEN NEEDED
	// 	let parameters = "{"
	// 	req.body.parameters.forEach((parameter, index)=> {
	// 		if (index > 0){
	// 			parameters += ", "
	// 		}
	// 		parameters += parameter
	// 	})

	// 	req.body.input_parameters.forEach((input_parameter, index)=> {
	// 		if (index > 0 || parameters !== ""){
	// 			parameters += ", "
	// 		}
	// 		parameters += '"'+req.body.input_parameter_names[index] +'" : "'+ input_parameter+'"'
	// 	})

	// 	parameters += "}"

	// 	subscription.name = req.body.name

	// 	subscription.email_to = req.body.email_to
	// 	subscription.subject = req.body.subject
	// 	subscription.body = req.body.body						

	// 	subscription.start_date = req.body.start_date
	// 	subscription.time = req.body.time		
	// 	subscription.parameters = parameters;
	// 	subscription.NODEReportId = req.params.reportid
	// 	subscription.NODEFrequencyId = req.body.frequency

	// 	subscription.save();

	// 	res.redirect("/reports/" +req.params.reportid+"/subscriptions");
	// })   	
	// .catch(err => {
	// 	errorController.get404()
	// })				
};


exports.updateSubscriptions = async(req,res) => { //, middleware.isCampGroundOwnership
	
	// let subscriptions;

	// // check if subscriptions have been passed
	// for (let itemsFromBodyIndex in req.body){
	// 	if(itemsFromBodyIndex === "subscriptions"){
			
	// 		subscriptions = req.body.subscriptions
	// 	}
	// }

	// if(subscriptions){

	// 	databaseQueriesUtil.getSubscriptions(req.params.reportid, subscriptions)
	// 	.then((subscriptions) => {

	// 		let subscription_ids = []
	// 		subscriptions.forEach((subscription, i) => {
	// 			subscription_ids.push(subscription.id);
	// 		})			

	// 		switch(req.body.action) {
	// 			case "run":

	// 				databaseQueriesUtil.getFullReport(req.params.reportid, "report, fusions, subsections, parameters")
	// 				.then((result) => {
	// 					ssrsUtil.run(subscriptions, result[0], result[1], result[2], result[3], result[4]);
	// 					req.flash("success", 'Running Selected Active Subscriptions');
	// 					res.redirect("/reports/" +req.params.reportid+"/subscriptions");
	// 				})					
	// 				break;
	// 			case "enable":
	// 				databaseQueriesUtil.bulkUpdateSubscriptions(subscriptions, {active: 1})
	// 				.then((subscriptions) => {
	// 					res.redirect("/reports/" +req.params.reportid+"/subscriptions");
	// 				})
	// 				break;
	// 			case "disable":
	// 				databaseQueriesUtil.bulkUpdateSubscriptions(subscriptions, {active: 0})
	// 				.then((subscriptions) => {
	// 					res.redirect("/reports/" +req.params.reportid+"/subscriptions");
	// 				})

	// 				break;
	// 			case "delete":

	// 				databaseQueriesUtil.destroySubscription(subscription_ids)
	// 				.then((result) => {
	// 					req.flash("success", 'Selected Subscriptions Deleted');
	// 					res.redirect("/reports/" +req.params.reportid+"/subscriptions");
	// 				})
					
	// 				break;									
	// 			default:
	// 		}
	// 	})
	// 	.catch(err => {
	// 		errorController.get404()
	// 	})			
	// }else{
	// 	res.redirect("/reports/" +req.params.reportid+"/subscriptions");
	// }

};
