// const errorController = require('../controllers/error');
const databaseQueriesUtil = require('../util/database_queries');
const functionsUtil = require('../util/functions');


exports.getRouteInfo = () => {

    let route_info;

    route_info = {
        parameters: {
            route: "admin/parameters"
            ,menu_name: "Parameters"
            ,get_all_function: "getParameters"
            ,get_single_function: "getParameter"
            ,create_function: "createParameter"
            ,delete_function: "deleteParameter"            
            ,edit_fields: ['name','query']
            ,type: "Parameter"
        }
        ,subsections: {
            route: "admin/subsections"
            ,menu_name: "Sub Sections"
            ,get_all_function: "getSubSections"
            ,get_single_function: "getSubSection"
            ,create_function: "createSubSection"
            ,delete_function: "deleteSubSection"               
            ,edit_fields: ['name','path', 'description']
            ,fusion_from: ["Parameter"]
            ,fusion_to: "SubSection"
            ,type: "SubSection"
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

        items.sort(functionsUtil.compare)

        res.render("admin/show", {menu_name: item_info.menu_name, type:type, data: items})
    }) 	
};

exports.getFormCreateItem = (req,res) => { //middleware.isLoggedIn, 

    let type = req.params.item;
    let route_info = exports.getRouteInfo()
    
    let item_info = route_info[type];

    //GET ALL FUSABLE DATA FOR FORM DROPDOWNS
    databaseQueriesUtil.getAllFusableData(item_info.fusion_from)
    .then((fusable_data) => {    
        res.render("admin/new", {item_info: item_info, type: type, fusable_data:fusable_data});
    })
};

exports.createItem = (req,res) => {
    
    let type = req.params.item;
    let route_info = exports.getRouteInfo()
    
    let item_info = route_info[type];

    databaseQueriesUtil[item_info.create_function](req.body)
    .then((item)=> {
        
        let fusions = req.body.fusions
        if (fusions){

            databaseQueriesUtil.createFusionsFromBody(item_info.fusion_to, item, fusions)
            .then((fusions) => {
                res.redirect("/admin/"+type);        
            })
        }

        res.redirect("/admin/"+type);
    }) 
    	
};



exports.getEditItems = (req,res) => {
    
    let type = req.params.item;
    let id = Number(req.params.id)
    let route_info = exports.getRouteInfo()
    
    let item_info = route_info[type];

    //GET THE ITEM BEING EDITTED
    databaseQueriesUtil[item_info.get_single_function](id)
    .then((item)=> {

        //GET ALL FUSABLE DATA FOR FORM DROPDOWNS
        if (item_info.fusion_from){
            databaseQueriesUtil.getAllFusableData(item_info.fusion_from)
            .then((fusable_data) => {

                //GET ALL FUSIONS
                databaseQueriesUtil.getFusions(id, item_info.fusion_from, item_info.fusion_to)
                .then((fusions)=> { 
                    //GET LINKED DATA
                    if(fusions && fusions.length > 0){
                        databaseQueriesUtil.getAllLinkedFusionData(fusions)
                        .then((linked_data) => {
                            res.render("admin/edit", {item_info: item_info, type:type, data: item, fusable_data: fusable_data, fusions: fusions, linked_data: linked_data})
                        })     
                    }
                    else{
                        res.render("admin/edit", {item_info: item_info, type:type, data: item, fusable_data: fusable_data, fusions:null, linked_data:null})
                    }

                })
            })
        }
        else{ 
            res.render("admin/edit", {item_info: item_info, type:type, data: item, fusable_data:null, fusions:null, linked_data:null})
        }


    }) 	  
};



exports.updateItem = (req,res) => { //, middleware.isCampGroundOwnership

    let type = req.params.item;
    let route_info = exports.getRouteInfo()
    
    let item_info = route_info[type];    

    // res.redirect("/admin/" + type)

    //GET THE ITEM BEING EDITTED
    databaseQueriesUtil[item_info.get_single_function](req.params.id)
    .then((item)=> {
        if(item){
            for(const key in req.body){
                // console.log(key)
                if (key !== "fusions"){
                    item[key] = req.body[key]
                }
            }
            item.save()
            .then((item) => {
                
                //GET ALL FUSIONS
                databaseQueriesUtil.getFusions(req.params.id, item_info.fusion_from, item_info.fusion_to)
                .then((current_fusions)=> {
                    //CHECK TO SEE IF THERE'S ANY FUSIONS THAT NEED SAVING                 
                    if(req.body.fusions){
                        databaseQueriesUtil.createFusionsFromBody(item_info.fusion_to, item, req.body.fusions)
                        .then((fusions) => {

                            //RETURN WHICH CURRENT FUSIONS AND DELETE ANY THAT AREN'T IN BODY

                            //LOOP THROUGH FUSIONS
                            let id_list = []
                            current_fusions.forEach((current_fusion) => {
                                let found = fusions.find(element => element[0].join_from_id === current_fusion.join_from_id && element[0].join_from === current_fusion.join_from);                                
                                if(found == null)
                                {
                                    id_list.push(current_fusion.id)
                                }                            
                            })

                            if(id_list){
                                databaseQueriesUtil.destroyFusionsByID(id_list)
                                .then((result) => {
                                    res.redirect("/admin/"+type);
                                })
                            }
                            else{
                                res.redirect("/admin/"+type);        
                            }
                        })                        
                    }
                    else{
                        res.redirect("/admin/" + type)
                    }
                })
            })
        }
        else {
            res.redirect("/admin/" + type)
        }
    })    
		
};


exports.deleteItem = (req,res) => { //, middleware.isCampGroundOwnership
    
    let type = req.params.item;
    let route_info = exports.getRouteInfo()
    
    let item_info = route_info[type];    


    let search_data = {
        join_from_id: req.params.id
        ,join_from: item_info.type
    }    
    databaseQueriesUtil.getFusions2(search_data)
    .then((reliant_fusions)=> {   

        if(reliant_fusions && reliant_fusions.length > 0){
            req.flash("error", "Can't Delete Item as there's fusions reliant on it");
            res.redirect("/admin/" + type + "/" + req.params.id + '/edit');
        }
        else{
            //GET THE ITEM BEING EDITTED
            databaseQueriesUtil[item_info.get_single_function](req.params.id)
            .then((item)=> {

                databaseQueriesUtil[item_info.delete_function](Number(req.params.id))
                .then((d_item) => {

                    if (item_info.fusion_to && item_info.fusion_from)
                    {
                        search_data = {
                            join_to_id: req.params.id
                            ,join_to: item_info.fusion_to
                            ,join_from: item_info.fusion_from
                        }
    
                        //GET ALL FUSIONS
                        // databaseQueriesUtil.getFusions(req.params.id, item_info.fusion_from, item_info.fusion_to)
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
                                    res.redirect("/admin/" + type) 
                                })
                            }
                            else{
                                res.redirect("/admin/" + type) 
                            }
                        })                        
                    }
                    else{
                        res.redirect("/admin/" + type) 
                    }

                })        

            })
        }

    })
		
};