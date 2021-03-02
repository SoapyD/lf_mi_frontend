const Report = require("../models/report");
// const Fusion = require("../models/fusion");
// const SubSection = require("../models/subsection");
const databaseQueriesUtil = require('../util/database_queries');
const errorController = require('../controllers/error');
// const Subscription = require("../models/subscription");

exports.getAllReports = (req,res) => {
	
	databaseQueriesUtil.getAllReports()
	.then((reports) => {
		res.render("reports/index", {reports:reports});
	})
	.catch(err => {
		errorController.get404()
	})	
};



exports.getReport = (req, res) => {

	databaseQueriesUtil.getFullReport(req.params.reportid, "report, fusions, all subsections")
	.then((result) => {
		res.render("reports/show_TEST2", {report:result[0], fusions:result[1], subsections: result[2]});
	})
	.catch(err => {
		errorController.get404()
	})
};

exports.getFormCreateReport = (req,res) => {
	res.render("reports/new");
};

exports.createReport = (req,res) => {
	
	Report.create ({
		name: req.body.name
		,description: req.body.description
		,owner: req.session.passport.user.id
	})
	.then(report => {
		// console.log(result);
		res.redirect("/reports/" +report.id);
	})
	.catch(err => {
		errorController.get404()
	})

};


exports.getEditReport = (req,res) => {

	Report.findByPk(req.params.reportid)
	.then((report) => {
		res.render("reports/edit", {report:report});
	})		
	.catch(err => {
		errorController.get404()
	})
};

exports.updateReport = (req,res) => {
	
	Report.findByPk(req.params.reportid)
	.then((report) => {
		report.name = req.body.report.name;
		report.description = req.body.report.description;
	
		report.save()
		.then((report) => {
			res.redirect("/reports/" +req.params.reportid)
		})
		.catch(err => {
			errorController.get404()
		})		
	})	
	.catch(err => {
		errorController.get404()
	})			
};


exports.updateCopyReport = (req,res) => {
	

	databaseQueriesUtil.getFullReport(req.params.reportid, "report, fusions, subsections, parameters")
	.then((old_report_data) => {

		databaseQueriesUtil.copyReport(req.session.passport.user.id, req.params.reportid, old_report_data)
		.then((new_report_data) => {
			let old_report = old_report_data[0]
			req.flash("success", 'Sucessfully copied report: '+old_report.name);		
			res.redirect("/reports/");
		})
	})					
	.catch(err => {
		errorController.get404()
	})			
};


exports.deleteReport = (req,res) => { //, middleware.isCampGroundOwnership
	

	databaseQueriesUtil.getActiveSubscriptions(req.params.reportid)
	.then((subscriptions) => {

		if(subscriptions && subscriptions.length > 0){
			req.flash("error", 'Error, cannot delete a report with active subscriptions. Please disable or delete all subscriptions and try again.');
			res.redirect("/reports/"+req.params.reportid)
		}
		else{
			databaseQueriesUtil.destroyReport(req.params.reportid)
			.then((data) => {

				//GET ANY SUBSECTION FUSIONS SO THEY CAN BE DELETED
				search_data = {
					join_to_id: req.params.reportid
					,join_to: "Report"
					,join_from: "SubSection"
				}

				//GET ALL FUSIONS
				databaseQueriesUtil.getFusions2(search_data)
				.then((current_fusions)=> {

					if(current_fusions){
						let fusion_ids = []
						current_fusions.forEach((fusion) => {
							fusion_ids.push(fusion.id)
						})
		
						//DELETE ALL ASSOCIATED FUSIONS
						databaseQueriesUtil.destroyFusionsByID(fusion_ids)
						.then((current_fusions)=> {
							req.flash("success", 'Sucessfully deleted report');
							res.redirect("/reports/")
						})
					}
					else{
						req.flash("success", 'Sucessfully deleted report');
						res.redirect("/reports/")
					}


				})

			})
			.catch(err => {
				req.flash("error", 'Error, could not delete report');
				res.redirect("/reports/")
			})			
		}
	})

};