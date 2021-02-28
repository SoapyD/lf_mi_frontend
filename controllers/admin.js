// const errorController = require('../controllers/error');
const databaseQueriesUtil = require('../util/database_queries');


exports.getRouteInfo = () => {

    let route_info;

    route_info = {
        parameters: {
            route: "admin/parameters"
            ,menu_name: "Parameters"
            ,get_all_function: "getParameters"
            ,get_single_function: "getParameter"
            ,create_function: "createParameter"            
            ,edit_fields: ['name','query']
        }
        ,subsections: {
            route: "admin/subsections"
            ,menu_name: "Sub Sections"
            ,get_all_function: "getSubSections"
            ,get_single_function: "getSubSection"
            ,create_function: "createSubSection"               
            ,edit_fields: ['name','path', 'description']
            ,fusion_from: "parameter"
            ,fusion_to: "subsection"
        }       
        
    } 

      return route_info
}


exports.getAllOptions = (req,res) => { 

    let route_info = exports.getRouteInfo()
    res.render("admin/index", {route_info: route_info})	
};

exports.getItems = (req,res) => {
    
    let type = req.params.item;
    let route_info = exports.getRouteInfo()
    
    let item_info = route_info[type];

    databaseQueriesUtil[item_info.get_all_function]()
    .then((items)=> {
        res.render("admin/show", {menu_name: item_info.menu_name, type:type, data: items})
    }) 	
};

exports.getFormCreateItem = (req,res) => { //middleware.isLoggedIn, 

    let type = req.params.item;
    let route_info = exports.getRouteInfo()
    
    let item_info = route_info[type];

	res.render("admin/new", {item_info: item_info, type: type});
};

exports.createItem = (req,res) => {
    
    let type = req.params.item;
    let route_info = exports.getRouteInfo()
    
    let item_info = route_info[type];

    databaseQueriesUtil[item_info.create_function](req.body)
    .then((item)=> {
        res.redirect("/admin/"+type);
    }) 
    	
};

exports.getEditItems = (req,res) => {
    
    let type = req.params.item;
    let id = Number(req.params.id)
    let route_info = exports.getRouteInfo()
    
    let item_info = route_info[type];

    databaseQueriesUtil[item_info.get_single_function](id)
    .then((item)=> {

        databaseQueriesUtil.getFusions(id, item_info.fusion_from, item_info.fusion_to)
        .then((fusions)=> {        
            
            //RETURN FUSIONS DATA IF THERE IS ANY
            if (fusions && fusions.length > 0){
                databaseQueriesUtil.getAllLinkedFusionData(fusions)
                .then((linked_data) => {
                    res.render("admin/edit", {item_info: item_info, type:type, data: item, fusions: fusions, linked_data: linked_data})
                })
            }
            else{
                res.render("admin/edit", {item_info: item_info, type:type, data: item, fusions: fusions})
            }

            
        })
    }) 	
};



exports.updateItem = (req,res) => { //, middleware.isCampGroundOwnership

    let type = req.params.item;
    let route_info = exports.getRouteInfo()
    
    let item_info = route_info[type];    

    res.redirect("/admin/" + type)

	// Report.findByPk(req.params.reportid)
	// .then((report) => {
	// 	report.name = req.body.report.name;
	// 	report.description = req.body.report.description;
	
	// 	report.save()
	// 	.then((report) => {
	// 		// console.log(report)
	// 		res.redirect("/reports/" +req.params.reportid)
	// 	})
	// 	.catch(err => {
	// 		errorController.get404()
	// 	})		
	// })	
	// .catch(err => {
	// 	errorController.get404()
	// })			
};


exports.deleteItem = (req,res) => { //, middleware.isCampGroundOwnership
    
    let type = req.params.item;
    let route_info = exports.getRouteInfo()
    
    let item_info = route_info[type];    

    res.redirect("/admin/" + type)    

	// databaseQueriesUtil.destroyReport(req.params.reportid)
	// .then((data) => {
	// 	req.flash("success", 'Sucessfully deleted report');
	// 	res.redirect("/reports/")
	// })
	// .catch(err => {
	// 	req.flash("error", 'Error, could not delete report');
	// 	res.redirect("/reports/")
	// })			
};