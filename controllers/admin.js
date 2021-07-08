
const utils = require("../utils");


exports.getRouteInfo = () => {

    let route_info;

    route_info = {
        parameter: {
            type: "Parameter"
            ,edit_fields: ['name','print_name','query']        
        }
        ,subsection: {
            type: "SubSection"
            ,edit_fields: ['name','path_snapshot','path_warehouse', 'description', 'period_type']
            ,join_from: ["Parameter"]
        }       
        
    } 

      return route_info
}


exports.getAllOptions = async(req,res) => { 

    try{
        let route_info = exports.getRouteInfo()
        res.render("admin/index", {route_info: route_info})	
    }
    catch(err){
        req.flash("error", "That admin page does not exist");
        res.redirect("/")         
    }
};

exports.getItems = async(req,res) => {
    
    let type = req.params.item;
    let route_info = exports.getRouteInfo()
    
    let type_info = route_info[type];

    let find_list = []
    find_list.push(
    {
        model: type_info.type,
        search_type: "findAll"
    }) 

    try{
        let data = await utils.queries.findData(find_list)

        if(data[0]){
            data[0] = data[0].sort(utils.functions.compareOrder)
        }


        res.render("admin/show", {type_info:type_info, data: data[0]})
    }
    catch(err){
        req.flash("error", "There was an error trying to get all admin data types");
        res.redirect("/")        
    }

    
	
};

exports.getFormCreateItem = async(req,res) => { //middleware.isLoggedIn, 

    let type = req.params.item;
    let route_info = exports.getRouteInfo()
    
    let type_info = route_info[type];

    let find_list = []
    find_list.push(
    {
        model: type_info.join_from,
        search_type: "findAll"
    }) 

    try{
        if (type_info.join_from)
        {
            let data = await utils.queries.findData(find_list)
            res.render("admin/new", {type_info: type_info, join_data:data});
        }
        else{
            res.render("admin/new", {type_info: type_info, join_data:[]});
        }
    }
    catch(err){
        // res.send("an error occurred")
        req.flash("error", "There was an error trying to get create data form for "+type);
        res.redirect("/admin/"+type)
    }

};

exports.createItem = async(req,res) => {
    
    let type = req.params.item;
    let route_info = exports.getRouteInfo()
    
    let type_info = route_info[type];

    let creation_list = []
    creation_list.push(
    {
        model: type_info.type,
        // params: [
        // {
        //     where: req.body.params
        // },
        // ]
        params: [req.body.params]       
    }) 

    try{
        let data = await utils.queries.createData2(creation_list)
       
        //IF RECORD EXISTS
        //DOESN'T WORK BECAUSE THE CREATION PROCESS CHECKS IF THE FIELDS PASSED MATCH, NOT JUST THE NAME
        if(data[0]){
            let joins = req.body.joins

            if(joins){
    
                let join_creation_list = []
    
                for(const key in joins){ 
                    if (joins[key] !== ''){
                        let join_data = joins[key].split('_')
                        let join_type_info = route_info[join_data[0].toLowerCase()];
    
                        // console.log(data[0].id)
                        let rules = []
                        rules["model"] = type_info.type+join_type_info.type
                        rules["params"] = []
                        let params = {}
                        // params["where"] = {}
                        // params["where"][type+"Id"] = data[0][0].id
                        // params["where"][join_data[0].toLowerCase()+"Id"] = Number(join_data[1])
                        // rules["params"].push(params)
                        params[type+"Id"] = data[0].id
                        params[join_data[0].toLowerCase()+"Id"] = Number(join_data[1])
                        rules["params"].push(params)    

                        join_creation_list.push(rules) 
                        
    
                    }
                }        
                let join_data = await utils.queries.createData2(join_creation_list)
                res.redirect("/admin/"+type);
                //IF THERE ARE ANY JOINS, TURN THEM INTO SEARCH TERMS
            }
            else{
                res.redirect("/admin/"+type); 
            }                
        }
        else{
            req.flash("error", "cannot create "+type+" that has the same name as an existing "+type+". Please choose another name");
            res.redirect("/admin/"+type);             
        }



    }
    catch (err){
        console.log(err)
        req.flash("error", "There was an error trying to save record for "+type);
        res.redirect("/admin/"+type); 
    }
    	
};



exports.getEditItems = async(req,res) => {
    
    let type = req.params.item;
    let id = Number(req.params.id)
    let route_info = exports.getRouteInfo()
    
    let type_info = route_info[type];

    try {
        let findlist = []

        let search_criteria = {
            model: type_info.type,
            search_type: "findOne",
            params: [
                {
                    where: {
                        id: id
                    }
                }
            ]
        }
    
        //APPEND THE INCLUDE FOR ANY JOINS ASSOCIATED WITH THE SEARCH TYPE
    
        if(type_info.join_from){
            type_info.join_from.forEach((join_type) => {
                search_criteria['params'][0]["include"] = utils.queries.searchType["SubSection"].include
            })
        
            
        }
        findlist.push(search_criteria) 
    
        //GET THE EDITABLE ITEM, INCLUDING ANY JOINS
        let data = await utils.queries.findData(findlist)
    
    
        //GET ALL JOINABLE DATA
        if (type_info.join_from)
        {
    
            findlist = []
            findlist.push(
            {
                model: type_info.join_from,
                search_type: "findAll"
            }) 
    
            let join_data = await utils.queries.findData(findlist)
    
            res.render("admin/edit", {type_info: type_info, data: data[0], join_data: join_data})
        }
        else{
            res.render("admin/edit", {type_info: type_info, data: data[0], join_data: []})
        }
    }
    catch (err){
        console.log(err)
        req.flash("error", "There was an error trying to retrieve record for "+type);
        res.redirect("/admin/"+type); 
    }


};



exports.updateItem = async(req,res) => { //, middleware.isCampGroundOwnership

    let id = Number(req.params.id)    
    let type = req.params.item;
    let route_info = exports.getRouteInfo()
    
    let type_info = route_info[type];    

    let findlist = []
    findlist.push({
        model: type_info.type,
        search_type: "findOne",
        params: [
            {
                where: {
                    id: id
                }
            }
        ]
    })

    try {
        //FIND THE RECORD WE'RE UPDATING
        let data = await utils.queries.findData(findlist)

        let updatelist = []
        updatelist.push({
            params: [
                req.body.params
            ]
        })    

        //UPDATE THE RECORD
        data = await utils.queries.updateData(data[0], updatelist)


        //LOOP THROUGH AND SAVE THE JOINS IN THE BODY
        let joins = req.body.joins
        let join_type_info;
        let rules = [];
        let params = {}
        let created_join_data;

        if(joins){
        
            let join_creation_list = []

            for(const key in joins){ 
                if (joins[key] !== ''){
                    let join_data = joins[key].split('_')
                    join_type_info = route_info[join_data[0].toLowerCase()];

                    rules = []
                    rules["model"] = type_info.type+join_type_info.type
                    rules["params"] = []
                    params = {}
                    // params["where"] = {}
                    // params["where"][type+"Id"] = data[0].id
                    // params["where"][join_data[0].toLowerCase()+"Id"] = Number(join_data[1])
                    params[type+"Id"] = data[0].id
                    params[join_data[0].toLowerCase()+"Id"] = Number(join_data[1])                    
                    rules["params"].push(params)

                    join_creation_list.push(rules) 
                }
            }        
            created_join_data = await utils.queries.createData2(join_creation_list)
        }


        //GET THE JOINS ALREADY ASSOCIATED WITH THE ITEM
        
        type_info.join_from.forEach(async(join_type) => {

            findlist = []
            rules = []
            rules["model"] = type_info.type+join_type
            rules["search_type"] = "findAll"
            rules["params"] = []
            params = {}
            params["where"] = {}
            params["where"][type+"Id"] = data[0].id
            rules["params"].push(params)

            findlist.push(rules) 
    

            let join_data = await utils.queries.findData(findlist)
        
            if(join_data){

                let destroylist = []

                //CHECK THE OLD JOINS STILL EXIST
                join_data[0].forEach((join) => {
                    let check = created_join_data.find(element => 
                        element[type_info.type+'Id'] === join[type_info.type+'Id'] 
                        && element[join_type+'Id'] === join[join_type+'Id']
                        );

                    //if it doesn't delete it
                    if(!check){
                        rules = []
                        rules["model"] = type_info.type+join_type
                        rules["params"] = []
                        params = {}
                        params["where"] = {}
                        params["where"][type+"Id"] = join[type_info.type.toLowerCase()+'Id'] 
                        params["where"][join_type.toLowerCase()+"Id"] = join[join_type.toLowerCase()+'Id']
                        rules["params"].push(params)

                        destroylist.push(rules) 
                    }
                })
                
                utils.queries.destroyData(destroylist)
            }
         

        })

        

        res.redirect("/admin/"+type);
    }
    catch (err){
        console.log(err)
        req.flash("error", "There was an error trying to save record for "+type);
        res.redirect("/admin/"+type+'/'+id); 
    }


};


exports.deleteItem = async(req,res) => { //, middleware.isCampGroundOwnership
    
    let type = req.params.item;
    let route_info = exports.getRouteInfo()
    
    let type_info = route_info[type];    
    let id = Number(req.params.id) 


    //CHECK THERE AREN'T EXISTING JOINS BASED ON THE ELEMENT

    //GET THE ITEM BEING DELETED

    let findlist = []
    findlist.push({
        model: type_info.type,
        search_type: "findOne",
        params: [
            {
                where: {
                    id: id
                }
            }
        ]
    })

    try {
        //FIND THE RECORD WE'RE UPDATING
        let data = await utils.queries.findData(findlist)

        //DELETE THE ITEM
        let destroylist = []
        destroylist.push({
            model: type_info.type,
            params: [
                {
                    where: {
                        id: id
                    }
                }
            ]
        })
        //THIS DELETION WILL ALSO DELETE ANY JOINED TABLE ROWS USING THIS ITEM
        let deletions = await utils.queries.destroyData(destroylist)

        res.redirect("/admin/" + type)


    }
    catch(err){
        console.log(err)
        req.flash("error", "There was an error trying to delete record for "+type);
        res.redirect("/admin/"+type+'/'+id); 
    }

};