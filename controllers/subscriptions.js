const Report = require("../models/report");
const Subscription = require("../models/subscription");
const databaseController = require('../controllers/database');
const ssrsController = require('../controllers/ssrs2');
const errorController = require('../controllers/error');

exports.getSubscriptions = (req,res) => { //, middleware.isLoggedIn

	databaseController.getReport(req.params.reportid)
	.then((report) => {
		databaseController.getSubscriptions(req.params.reportid)
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

	databaseController.getReport(req.params.reportid)
	.then((report) => {

		databaseController.getAllFrequencies()
		.then((frequencies) => {		
			databaseController.getSubscriptionParameters(req.params.reportid)
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

	databaseController.getReport(req.params.reportid)
	.then((report) => {
		databaseController.getSubscription(req.params.subscriptionid)
		.then((subscription) => {

			// let frequencies = databaseController.getAllFrequencies();
			databaseController.getAllFrequencies()
			.then((frequencies) => {
				databaseController.getSubscriptionParameters(req.params.reportid)
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
	
	databaseController.getSubscription(req.params.subscriptionid)
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
			if (index > 0){
				parameters += ", "
			}
			parameters += '"'+req.body.input_parameter_names[index] +'" : "'+ input_parameter+'"'
		})

		parameters += "}"

		subscription.name = req.body.name
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

		databaseController.getSubscriptions(req.params.reportid, subscriptions)
		.then((subscriptions) => {

			let subscription_ids = []
			subscriptions.forEach((subscription, i) => {
				subscription_ids.push(subscription.id);
			})			

			switch(req.body.action) {
				case "run":
					databaseController.getFullReport(req.params.reportid, "report, fusions, sections, parameters")
					.then((result) => {
						ssrsController.run(subscriptions, result[0], result[1], result[2], result[3], result[4]);
						req.flash("success", 'Running Selected Reports');
						res.redirect("/reports/" +req.params.reportid+"/subscriptions");
					})					
					break;
				case "enable":
					res.redirect("/reports/" +req.params.reportid+"/subscriptions");
					break;
				case "disable":
					res.redirect("/reports/" +req.params.reportid+"/subscriptions");
					break;
				case "delete":

					databaseController.destroySubscriptions(subscription_ids)
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
