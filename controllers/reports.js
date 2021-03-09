const Report = require("../models/report");
// const Fusion = require("../models/fusion");
// const SubSection = require("../models/subsection");
const databaseQueriesUtil = require('../util/database_queries2');
const functionsUtil = require('../util/functions');
// const errorController = require('../controllers/error');
// const Subscription = require("../models/subscription");

exports.getAllReports = async(req,res) => {
	
    let find_list = []
    find_list.push(
    {
        model: "Report",
        search_type: "findAll"
    }) 

    try{
        let reports = await databaseQueriesUtil.findData(find_list)
        res.render("reports/index", {reports:reports[0]});
    }
    catch(err){
        console.log(err)
        req.flash("error", "There was an error trying to get report data");
        res.redirect("/")        
    }
	
};



exports.getReport = async(req, res) => {

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

		//SORT THE REPORT SUBSECTIONS BY ORDER
		let report = functionsUtil.sortReport(reports[0])

		//GET ALL SUBSECTION DATA
		find_list = []
		find_list.push(
		{
			model: "SubSection",
			search_type: "findAll"
		}) 
	
		let subsections = await databaseQueriesUtil.findData(find_list)
		if(subsections[0]){
			subsections[0] = subsections[0].sort(functionsUtil.compareOrder)
		}


        res.render("reports/show", {report:report, subsections: subsections[0]});
    }
    catch(err){
        console.log(err)
        req.flash("error", "There was an error trying to get report data");
        res.redirect("/reports")        
    }

};

exports.getFormCreateReport = (req,res) => {
	res.render("reports/new");
};

exports.createReport = async(req,res) => {
	

	try{
		let params = req.body.params
		params["owner"] = req.session.passport.user.id

		let creation_list = []
		creation_list.push(
		{
			model: "Report",
			// params: [
			// {
			// 	where: req.body.params
			// },  
			params: [
				req.body.params
			]
		}) 

		let reports = await databaseQueriesUtil.createData2(creation_list)	
		if(reports[0]){
			res.redirect("/reports/" +reports[0].id);
		}
        else{
            req.flash("error", "cannot create report that has the same name as an existing report. Please choose another name");
            res.redirect("/admin/"+type);             
        }
	}
	catch(err){
		console.log(err)
		req.flash("error", "There was an error trying to create your report");
		res.redirect("/reports")        
	}	


};


exports.getEditReport = async(req,res) => {

	let id = req.params.reportid;

    try {
		let findlist = []
		findlist.push({
            model: "Report",
            search_type: "findOne",
            params: [
                {
                    where: {
                        id: id
                    }
                }
            ]
        })

        //GET THE EDITABLE ITEM, INCLUDING ANY JOINS
		let reports = await databaseQueriesUtil.findData(findlist)

		res.render("reports/edit", {report:reports[0]});
	}
	catch(err){
		console.log(err)
		req.flash("error", "There was an error trying to edit your report");
		res.redirect("/reports/"+ id)        
	}	

};

exports.updateReport = async(req,res) => {
	
	let id = req.params.reportid;
	
	try {
		let findlist = []
		findlist.push({
			model: "Report",
			search_type: "findOne",
			params: [
				{
					where: {
						id: id
					}
				}
			]
		})

		//GET THE EDITABLE ITEM, INCLUDING ANY JOINS
		let reports = await databaseQueriesUtil.findData(findlist)


		let updatelist = []
		updatelist.push({
			params: [
				req.body.params
			]
		})    

		//UPDATE THE RECORD
		let data = await databaseQueriesUtil.updateData(reports[0], updatelist)
		res.redirect("/reports/" +id)
	}	
	catch(err){
		console.log(err)
		req.flash("error", "There was an error trying to update your report");
		res.redirect("/reports/"+ id)        
	}	
};

exports.updateJoinReport = async(req,res) => {
    //GET ALL CURRENT JOINS
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

	    //GET FULL REPORT
		let reports = await databaseQueriesUtil.findData(find_list)
        let report = reports[0]

		///////////////////////////////////////////////////////////////////////////////////////////////////



		//DELETE THE ITEM
		let destroylist = []

		// let report_deletions = {
		// 	model: "Report",
		// 	search_type: "findOne",
		// 	params: [
		// 		{
		// 			where: {
		// 				id: id
		// 			}
		// 		}
		// 	]
		// }
		//GET FULL REPORT DATA
		// let reports = await databaseQueriesUtil.findData(destroylist)
		//THIS DELETION WILL ALSO DELETE ANY JOINED TABLE ROWS USING THIS ITEM
		// console.log("test")
		// let deletions = await databaseQueriesUtil.destroyData(report_destroylist)

		//DELETE ALL OF THE JOINS TOO
		destroylist = []
		let section_deletions = {}
		section_deletions["model"] = "Section"
		section_deletions["params"] = []

		let sectionsubsection_deletions = {}
		sectionsubsection_deletions["model"] = "SectionSubSection"
		sectionsubsection_deletions["params"] = []

		if (reports[0].sections){
			reports[0].sections.forEach((section) => {

				params = {}
				params["where"] = {}
				params["where"]["id"] = section.id 				
				section_deletions["params"].push(params)

				if (section.subsections){
					section.subsections.forEach((subsection) => {

						params = {}
						params["where"] = {}
						params["where"]["sectionId"] = section.id
						params["where"]["subsectionId"] = subsection.id						 				
						sectionsubsection_deletions["params"].push(params)

					})
				}
			})
		}
		destroylist.push(sectionsubsection_deletions)
		// destroylist.push(section_deletions)
		deletions = await databaseQueriesUtil.destroyData(destroylist)

		destroylist = []
		destroylist.push(section_deletions)
		deletions = await databaseQueriesUtil.destroyData(destroylist)



		//////////////////////////////////////////////////////////////////////////////////////////////////




        //CREATE THE SECTIONS AND SUBSECTIONS THAT HAVE BEEN PASSED FROM THE BODY

        let sections = req.body.Report
		let section_order = 1


		let created_section_LIST = [];
		let created_sectionsubsections_LIST = [];

        for(const section_key in sections){ 
            
            //CREATE SECTION

            let creation_list = []
            let create_sections = {}
            create_sections["model"] = "Section"
			create_sections["params"] = []

			//APPEND DATA TO THE SECTION
			params = {}
			params = sections[section_key]["params"]
            params["order"] = section_order			
            params["reportId"] = report.id
            create_sections["params"].push(params)
            creation_list.push(create_sections)
            let created_section = await databaseQueriesUtil.createData2(creation_list)
			created_section_LIST.push(created_section[0])

			if (created_section[0])
			{
				creation_list = []
				create_sections = {}
				
				let subsection_order = 1
	
				create_sections["model"] = "SectionSubSection"
				create_sections["params"] = []		
	
				for(const subsection_key in sections[section_key]){ 
					let subsection = sections[section_key][subsection_key]
		
					if (subsection_key.includes("Sub Section")){
		
						if(subsection.params.id !== ""){
	
					
							params = {}
	
							params["name"] = ''
							if(subsection["params"]["name"])
							{
								params["name"] = subsection["params"]["name"]
							}
							params["order"] = subsection_order
							params["sectionId"] = created_section[0].id
							params["subsectionId"] = Number(subsection["params"]["id"])
	
							create_sections["params"].push(params)
							
							subsection_order++;
						}
					}
				}
				creation_list.push(create_sections)

				if(creation_list.length > 0){
					let created_sectionsubsections = await databaseQueriesUtil.createData2(creation_list)
					created_sectionsubsections_LIST.push(created_sectionsubsections[0])
				}
				//CREATE SUBSECTIONS
				section_order++;
			}

        }        

		//CREATE SECTIONSUBSECTIONS
		req.flash("success", "Report Updated"); 
		res.redirect("/reports/"+ id)

    }
	catch(err){
		console.log(err)
		req.flash("error", "There was an error trying to update your report");
		res.redirect("/reports/"+ id)        
    }	
}


exports.updateCopyReport = async(req,res) => {
	
	let id = req.params.reportid;
	
	//GET FULL REPORT
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

		let creation_list = []

		//COPY THE REPORT
		let search_criteria = {}
		search_criteria["model"] = "Report"
		search_criteria["params"] = []
		params = {}
		// params["where"] = {
		params = {
			name: report.name + "_COPY",
			description: report.description,
			owner: req.session.passport.user.id
		}
		search_criteria["params"].push(params)

		creation_list.push(search_criteria)
		let copied_report = await databaseQueriesUtil.createData2(creation_list)
		
		if (report.sections){
			report.sections.forEach( async(section) => {

				creation_list = []
				let create_sections = {}
				create_sections["model"] = "Section"
				create_sections["params"] = []
				// params = {}
				// params["where"] = {
				params = {
					order: section.order,
					name: section.name,
					reportId: copied_report[0].id
				}
				create_sections["params"].push(params)
				creation_list.push(create_sections)
				let copied_section = await databaseQueriesUtil.createData2(creation_list)

				if(copied_section[0]){
					if (section.subsections){
						creation_list = []
	
						let create_sectionsubsections = {}
						create_sectionsubsections["model"] = "SectionSubSection"
						create_sectionsubsections["params"] = []
	
						section.subsections.forEach( async(subsection) => {
	
							let sectionsubsection = subsection.sectionsubsections
							// params = {}
							// params["where"] = {
							params = {							
								order: sectionsubsection.order,
								name: sectionsubsection.name,
								sectionId: copied_section[0].id,
								subsectionId: sectionsubsection.subsectionId
							}		
							create_sectionsubsections["params"].push(params)
						})
	
						creation_list.push(create_sectionsubsections)	
						let copied_sectionsubsections = await databaseQueriesUtil.createData2(creation_list)
					}
				}

			})
		}

		req.flash("success", 'Sucessfully copied report');		
		res.redirect("/reports/");

	}
	catch(err){
		console.log(err)
		req.flash("error", "There was an error trying to copy your report");
		res.redirect("/reports/"+ id)        
	}

};


exports.deleteReport = async(req,res) => { //, middleware.isCampGroundOwnership
	
	let id = req.params.reportid;
	
	try {

		//DELETE THE ITEM
		let destroylist = []
		destroylist.push({
			model: "Report",
			search_type: "findOne",
			params: [
				{
					where: {
						id: id
					},
					include: databaseQueriesUtil.searchType['Full Report'].include
				}
			]
		})
		//GET FULL REPORT DATA
		let reports = await databaseQueriesUtil.findData(destroylist)
		//THIS DELETION WILL ALSO DELETE ANY JOINED TABLE ROWS USING THIS ITEM
		// console.log("test")
		let deletions = await databaseQueriesUtil.destroyData(destroylist)

		//DELETE ALL OF THE JOINS TOO
		destroylist = []
		let section_deletions = {}
		section_deletions["model"] = "Section"
		section_deletions["params"] = []

		let sectionsubsection_deletions = {}
		sectionsubsection_deletions["model"] = "SectionSubSection"
		sectionsubsection_deletions["params"] = []

		if (reports[0].sections){
			reports[0].sections.forEach((section) => {

				params = {}
				params["where"] = {}
				params["where"]["id"] = section.id 				
				section_deletions["params"].push(params)

				if (section.subsections){
					section.subsections.forEach((subsection) => {

						params = {}
						params["where"] = {}
						params["where"]["sectionId"] = section.id
						params["where"]["subsectionId"] = subsection.id						 				
						sectionsubsection_deletions["params"].push(params)

					})
				}
			})
		}
		destroylist.push(sectionsubsection_deletions)
		destroylist.push(section_deletions)
		deletions = await databaseQueriesUtil.destroyData(destroylist)

		res.redirect("/reports/")
	}	
	catch(err){
		console.log(err)
		req.flash("error", "There was an error trying to update your report");
		res.redirect("/reports/"+ id)        
	}		

};