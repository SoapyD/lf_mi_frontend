const Report = require("../models/report");
const Subscription = require("../models/subscription");
const databaseQueriesUtil = require('../util/database_queries');
const errorController = require('../controllers/error');
const ssrsUtil = require('../util/ssrs2');

exports.getSubscriptions = (req,res) => { //, middleware.isLoggedIn

	databaseQueriesUtil.getReport(req.params.reportid)
	.then((report) => {
		databaseQueriesUtil.getSubscriptions(req.params.reportid)
		.then((subscriptions) => {

			res.render("subscriptions/index", {report:report, subscriptions:subscriptions});
		})   
		.catch(err => {
			errorController.get404()
		})		
	})     
	.catch(err => {
		errorController.get404()
	})	

};

exports.getFormCreateSubscription = (req,res) => { //middleware.isLoggedIn, 
	// res.render("subscriptions/new");

	databaseQueriesUtil.getReport(req.params.reportid)
	.then((report) => {

		databaseQueriesUtil.getAllFrequencies()
		.then((frequencies) => {		
			databaseQueriesUtil.getSubscriptionParameters(req.params.reportid)
			.then((parameter_set) => {					
				res.render("subscriptions/new", {report:report, frequencies:frequencies, parameter_set:parameter_set});
			})
			.catch(err => {
				errorController.get404()
			})				
		})
		.catch(err => {
			errorController.get404()
		})	
	})    	
	.catch(err => {
		errorController.get404()
	})	
};

exports.createSubscription = (req,res) => { //, middleware.isLoggedIn
	
	// let author = {
	// 	id: req.user._id,
	// 	username: req.user.username
	// }
	// let author = {
	// 	id: "5ef4d0322ad3f50b9b181ecA", //5ef4d0322ad3f50b9b181ec3
	// 	username: "tom_bombchild@hotmail.com"
	// }	
	
	// COMBINE THE PARAMETERS TOGETHER INTO A SINGLE STRING, WHICH CAN BE CONVERTED BACK TO AN OBJECT WHEN NEEDED	
	let parameters = "{"
	req.body.parameters.forEach((parameter, index)=> {
		if (index > 0){
			parameters += ", "
		}
		parameters += parameter
	})

	req.body.input_parameters.forEach((input_parameter, index)=> {
		if (index > 0 || parameters !== ""){
			parameters += ", "
		}
		parameters += '"'+req.body.input_parameter_names[index] +'" : "'+ input_parameter+'"'
	})

	parameters += "}"

	Subscription.create ({
		name: req.body.name
		,email_to: req.body.email_to
		,subject: req.body.subject
		,body: req.body.body			
		,start_date: req.body.start_date
		,time: req.body.time
		,parameters: parameters 		
		,NODEReportId: req.params.reportid
		,NODEFrequencyId: req.body.frequency
		// ,author: author
	})
	.then(subscription => {
		// console.log(subscription);
		
		res.redirect("/reports/"+req.params.reportid+"/subscriptions");
	})
	.catch(err => {
		errorController.get404()
	})	

};


exports.getEditSubscription = (req,res) => { //, middleware.isCampGroundOwnership

	databaseQueriesUtil.getReport(req.params.reportid)
	.then((report) => {
		databaseQueriesUtil.getSubscription(req.params.subscriptionid)
		.then((subscription) => {

			// let frequencies = databaseQueriesUtil.getAllFrequencies();
			databaseQueriesUtil.getAllFrequencies()
			.then((frequencies) => {
				databaseQueriesUtil.getSubscriptionParameters(req.params.reportid)
				.then((parameter_set) => {		
					let parameter_obj = JSON.parse(subscription.parameters);	

					res.render("subscriptions/edit", 
					{report:report, subscription:subscription, frequencies:frequencies, parameter_set:parameter_set, parameter_obj: parameter_obj});
				})
				.catch(err => {
					errorController.get404()
				})					
			})
			.catch(err => {
				errorController.get404()
			})				
		})   
		.catch(err => {
			errorController.get404()
		})			
	}) 
	.catch(err => {
		errorController.get404()
	})		

};


exports.updateSubscription = (req,res) => { //, middleware.isCampGroundOwnership
	
	databaseQueriesUtil.getSubscription(req.params.subscriptionid)
	.then((subscription) => {

		// COMBINE THE PARAMETERS TOGETHER INTO A SINGLE STRING, WHICH CAN BE CONVERTED BACK TO AN OBJECT WHEN NEEDED
		let parameters = "{"
		req.body.parameters.forEach((parameter, index)=> {
			if (index > 0){
				parameters += ", "
			}
			parameters += parameter
		})

		req.body.input_parameters.forEach((input_parameter, index)=> {
			if (index > 0 || parameters !== ""){
				parameters += ", "
			}
			parameters += '"'+req.body.input_parameter_names[index] +'" : "'+ input_parameter+'"'
		})

		parameters += "}"

		subscription.name = req.body.name

		subscription.email_to = req.body.email_to
		subscription.subject = req.body.subject
		subscription.body = req.body.body						

		subscription.start_date = req.body.start_date
		subscription.time = req.body.time		
		subscription.parameters = parameters;
		subscription.NODEReportId = req.params.reportid
		subscription.NODEFrequencyId = req.body.frequency

		subscription.save();

		res.redirect("/reports/" +req.params.reportid+"/subscriptions");
	})   	
	.catch(err => {
		errorController.get404()
	})				
};


exports.updateSubscriptions = (req,res) => { //, middleware.isCampGroundOwnership
	
	let subscriptions;

	// check if subscriptions have been passed
	for (let itemsFromBodyIndex in req.body){
		if(itemsFromBodyIndex === "subscriptions"){
			
			subscriptions = req.body.subscriptions
		}
	}

	if(subscriptions){

		databaseQueriesUtil.getSubscriptions(req.params.reportid, subscriptions)
		.then((subscriptions) => {

			let subscription_ids = []
			subscriptions.forEach((subscription, i) => {
				subscription_ids.push(subscription.id);
			})			

			switch(req.body.action) {
				case "run":

					databaseQueriesUtil.getFullReport(req.params.reportid, "report, fusions, subsections, parameters")
					.then((result) => {
						ssrsUtil.run(subscriptions, result[0], result[1], result[2], result[3], result[4]);
						req.flash("success", 'Running Selected Active Subscriptions');
						res.redirect("/reports/" +req.params.reportid+"/subscriptions");
					})					
					break;
				case "enable":
					databaseQueriesUtil.bulkUpdateSubscriptions(subscriptions, {active: 1})
					.then((subscriptions) => {
						res.redirect("/reports/" +req.params.reportid+"/subscriptions");
					})
					break;
				case "disable":
					databaseQueriesUtil.bulkUpdateSubscriptions(subscriptions, {active: 0})
					.then((subscriptions) => {
						res.redirect("/reports/" +req.params.reportid+"/subscriptions");
					})

					break;
				case "delete":

					databaseQueriesUtil.destroySubscription(subscription_ids)
					.then((result) => {
						req.flash("success", 'Selected Subscriptions Deleted');
						res.redirect("/reports/" +req.params.reportid+"/subscriptions");
					})
					
					break;									
				default:
			}
		})
		.catch(err => {
			errorController.get404()
		})			
	}else{
		res.redirect("/reports/" +req.params.reportid+"/subscriptions");
	}




};
