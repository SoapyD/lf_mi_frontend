const errorController = require('../controllers/error');

exports.getAllMenus = (req,res) => { 

    res.render("admin/index")
	// databaseController.getAllReports()
	// .then((reports) => {
	// 	res.render("reports/index", {reports:reports});
	// })
	// .catch(err => {
	// 	errorController.get404()
	// })	
};