// const Report = require("../models/report");
// const Subscription = require("../models/subscription");
const databaseQueriesUtil = require('../util/database_queries2');
const functionsUtil = require('../util/functions');
// const errorController = require('../controllers/error');
const ssrsUtil = require('../util/ssrs3');

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
			search_type: "findAll",
			params: [{
				where: {
					id: parameter_ids,
				}		
			}]
		}) 

		//GET ALL REPORT DATA
		let parameters = await databaseQueriesUtil.findData(find_list)

		if(parameters[0]){
			parameters[0] = parameters[0].sort(functionsUtil.compareOrder)
		}

		let parameter_values = await databaseQueriesUtil.runDBQueries(parameters[0])

		find_list = []
		find_list.push(
		{
			model: "Frequency",
			search_type: "findAll"
		}) 

		let frequencies = await databaseQueriesUtil.findData(find_list)		

		// res.render("subscriptions/index", {report:reports[0], subscriptions:subscriptions});
		res.render("subscriptions/new", {report:report, frequencies:frequencies[0], 
			parameters:parameters[0], parameter_values: parameter_values});
    }
    catch(err){
        console.log(err)
        req.flash("error", "There was an error trying to load new subscription form");
        res.redirect("/reports/"+id+"/subscriptions")        
    }

};

exports.createSubscription = async(req,res) => { //, middleware.isLoggedIn
	
	try{

		// COMBINE THE PARAMETERS TOGETHER INTO A SINGLE STRING, WHICH CAN BE CONVERTED BACK TO AN OBJECT WHEN NEEDED	
		let parameters = "{"

		if(req.body.parameters){
			req.body.parameters.forEach((parameter, index)=> {
				if (index > 0){
					parameters += ", "
				}
				parameters += parameter
			})
		}

		if(req.body.input_parameters){
			req.body.input_parameters.forEach((input_parameter, index)=> {
				if (index > 0 || parameters !== ""){
					parameters += ", "
				}
				parameters += '"'+req.body.input_parameter_names[index] +'" : "'+ input_parameter+'"'
			})
		}

		parameters += "}"


		let params = req.body.params;
		params['reportId'] = req.params.reportid
		params['parameters'] = parameters

		let creation_list = []
		creation_list.push(
		{
			model: "Subscription",
			params: [
				params
			]
		}) 

		let subscriptions = await databaseQueriesUtil.createData2(creation_list)	

		res.redirect("/reports/"+req.params.reportid+"/subscriptions");

	}
    catch(err){
        console.log(err)
        req.flash("error", "There was an error trying to save new subscription form");
        res.redirect("/reports/"+id+"/subscriptions")        
	}

};


exports.getEditSubscription = async(req,res) => {

	let id = req.params.reportid;
	let subscription_id = req.params.subscriptionid;

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

		//GET REPORT DATA
		let reports = await databaseQueriesUtil.findData(find_list)
		

		find_list = []
		find_list.push(
		{
			model: "Subscription",
			search_type: "findOne",
			params: [{
				where: {
					id: subscription_id,
				}			
			}]
		})		
		//GET SUBSCRIPTION DATA
		let subscriptions = await databaseQueriesUtil.findData(find_list)		

		let report = reports[0]

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
			search_type: "findAll",
			params: [{
				where: {
					id: parameter_ids,
				}		
			}]
		}) 

		//GET ALL REPORT DATA
		let parameters = await databaseQueriesUtil.findData(find_list)

		if(parameters[0]){
			parameters[0] = parameters[0].sort(functionsUtil.compareOrder)
		}

		let parameter_values = await databaseQueriesUtil.runDBQueries(parameters[0])


		find_list = []
		find_list.push(
		{
			model: "Frequency",
			search_type: "findAll"
		}) 

		let frequencies = await databaseQueriesUtil.findData(find_list)		
		let parameter_obj = JSON.parse(subscriptions[0].parameters);
		
		res.render("subscriptions/edit", 
		{report:report, subscription:subscriptions[0], frequencies:frequencies[0],
			parameters:parameters[0], parameter_values: parameter_values, 
			parameter_obj: parameter_obj});
		// res.render("subscriptions/index", {report:reports[0], subscriptions:subscriptions});
    }
    catch(err){
        console.log(err)
        req.flash("error", "There was an error trying to get subscription to edit");
        res.redirect("/reports/"+id+"/subscriptions")         
    }

};


exports.updateSubscription = async(req,res) => { //, middleware.isCampGroundOwnership

	let id = req.params.reportid;
	let subscription_id = req.params.subscriptionid;

	try{
		// COMBINE THE PARAMETERS TOGETHER INTO A SINGLE STRING, WHICH CAN BE CONVERTED BACK TO AN OBJECT WHEN NEEDED	
		let parameters = "{"

		if(req.body.parameters){
			req.body.parameters.forEach((parameter, index)=> {
				if (index > 0){
					parameters += ", "
				}
				parameters += parameter
			})
		}

		if(req.body.input_parameters){
			req.body.input_parameters.forEach((input_parameter, index)=> {
				if (index > 0 || parameters !== ""){
					parameters += ", "
				}
				parameters += '"'+req.body.input_parameter_names[index] +'" : "'+ input_parameter+'"'
			})
		}

		parameters += "}"


		let find_list = []
		find_list.push(
		{
			model: "Subscription",
			search_type: "findOne",
			params: [{
				where: {
					id: subscription_id,
				}			
			}]
		})		
		//GET SUBSCRIPTION DATA
		let subscriptions = await databaseQueriesUtil.findData(find_list)		


		let params = req.body.params;
		params['reportId'] = req.params.reportid
		params['parameters'] = parameters

		let update_list = []
		update_list.push(
		{
			model: "Subscription",
			params: [
				params
			]
		}) 

		let subscriptions_updated = await databaseQueriesUtil.updateData(subscriptions[0], update_list)	

		res.redirect("/reports/" +req.params.reportid+"/subscriptions");
    }
    catch(err){
        console.log(err)
        req.flash("error", "There was an error trying to get subscription to edit");
        res.redirect("/reports/"+id+"/subscriptions")        
    }
};


exports.updateSubscriptions = async(req,res) => { //, middleware.isCampGroundOwnership
	
	try{

		let id = req.params.reportid;

		let subscription_ids;

		// check if subscriptions have been passed
		for (let itemsFromBodyIndex in req.body){
			if(itemsFromBodyIndex === "subscriptions"){
				
				subscription_ids = req.body.subscriptions
			}
		}

		if(subscription_ids){

			let find_list = []
			find_list.push(
			{
				model: "Subscription",
				search_type: "findAll",
				params: [{
					where: {
						reportId: req.params.reportid,
						id: subscription_ids,
					}			
				}]
			})		
			//GET SUBSCRIPTION DATA
			let subscriptions = await databaseQueriesUtil.findData(find_list)		


			// databaseQueriesUtil.getSubscriptions(req.params.reportid, subscriptions)
			// .then((subscriptions) => {
			if(subscriptions[0]) {
				// let subscription_ids = []
				let list = []

				//GET THE FULL REPORT DATA
				list = []
				list.push(
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
				let reports = await databaseQueriesUtil.findData(list)

				let report = functionsUtil.sortReport(reports[0])
				// let delay_i = 0

				subscriptions[0].forEach( async(subscription, i) => {

					
					switch(req.body.action) {
					case "run":
						
						//RUN THE REPORT SUBSCRIPTIONS
						ssrsUtil.run(i, report, subscription);
						req.flash("success", 'Running Selected Active Subscriptions');
			
						break;
						case "enable":

							list = []
							list.push({
								params: [
									{active: 1}
								]
							})    
					
							//UPDATE THE RECORD
							await databaseQueriesUtil.updateData(subscription, list)

						break;
						case "disable":

							list = []
							list.push({
								params: [
									{active: 0}
								]
							})    
					
							//UPDATE THE RECORD
							await databaseQueriesUtil.updateData(subscription, list)

						break;
						case "delete":
							
							list = [];
							list.push({
								model: "Subscription",
								params: [
									{
										where: {
											id: subscription.id
										}
									}
								]
							})
					
							//DESTROY THE RECORD
							await databaseQueriesUtil.destroyData(list)

						break;									
						default:
					}
				})
				
				res.redirect("/reports/" +req.params.reportid+"/subscriptions");
			}
			else{
				res.redirect("/reports/" +req.params.reportid+"/subscriptions");			
			}
		}else{
			res.redirect("/reports/" +req.params.reportid+"/subscriptions");
		}
    }
    catch(err){
        console.log(err)
        req.flash("error", "There was an error trying to use subscriptions");
        res.redirect("/reports/"+id+"/subscriptions")        
    }
};
