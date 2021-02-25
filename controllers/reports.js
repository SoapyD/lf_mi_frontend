const Report = require("../models/report");
const Fusion = require("../models/fusion");
const Section = require("../models/section");
const databaseController = require('../controllers/database');
const errorController = require('../controllers/error');

exports.getAllReports = (req,res) => { //middleware.isLoggedIn, 
	
    // Report.findAll({
    //     order: [ [ 'name', 'ASC' ]]
    // }).then((reports) => {
	// 	res.render("reports/index", {reports:reports});
	// })
	databaseController.getAllReports()
	.then((reports) => {
		res.render("reports/index", {reports:reports});
	})
	.catch(err => {
		errorController.get404()
	})	
};



exports.getReport = (req, res) => { //middleware.isLoggedIn, 

	databaseController.getFullReport(req.params.reportid, "report, fusions, all sections")
	.then((result) => {
		// res.render("reports/show", {report:result[0], fusions:result[1], sections: result[2]});
		res.render("reports/show_TEST2", {report:result[0], fusions:result[1], sections: result[2]});
	})
	.catch(err => {
		errorController.get404()
	})
};

exports.getFormCreateReport = (req,res) => { //middleware.isLoggedIn, 
	res.render("reports/new");
};

exports.createReport = (req,res) => { //, middleware.isLoggedIn
	
	// let author = {
	// 	id: req.user._id,
	// 	username: req.user.username
	// }
	// let author = {
	// 	id: "5ef4d0322ad3f50b9b181ecA", //5ef4d0322ad3f50b9b181ec3
	// 	username: "tom_bombchild@hotmail.com"
	// }	
	
	Report.create ({
		name: req.body.name
		,description: req.body.description
		// ,author: author
	})
	.then(report => {
		// console.log(result);
		res.redirect("/reports/" +report.id);
	})
	.catch(err => {
		errorController.get404()
	})

};


exports.getEditReport = (req,res) => { //, middleware.isCampGroundOwnership

	Report.findByPk(req.params.reportid)
	.then((report) => {
		res.render("reports/edit", {report:report});
	})		
	.catch(err => {
		errorController.get404()
	})
};

exports.updateReport = (req,res) => { //, middleware.isCampGroundOwnership
	
	Report.findByPk(req.params.reportid)
	.then((report) => {
		report.name = req.body.report.name;
		report.description = req.body.report.description;
	
		report.save()
		.then((report) => {
			// console.log(report)
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


exports.updateCopyReport = (req,res) => { //, middleware.isCampGroundOwnership
	

	databaseController.getFullReport(req.params.reportid, "report, fusions, sections, parameters")
	.then((old_report_data) => {

		databaseController.copyReport(req.params.reportid, old_report_data)
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
	
	databaseController.destroyReport(req.params.reportid)
	.then((data) => {
		req.flash("success", 'Sucessfully deleted report');
		res.redirect("/reports/")
	})
	.catch(err => {
		req.flash("error", 'Error, could not delete report');
		res.redirect("/reports/")
	})			
};