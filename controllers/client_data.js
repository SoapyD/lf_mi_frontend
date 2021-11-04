

const utils = require("../utils");


exports.getRouteInfo = () => {

    let route_info;

    route_info = [
        {type: "orgunit", sort_field: "dim_orgunit_orgunt", model: "Dimension_Orgunit", id_column: "dim_orgunit_pk", form_path: "./forms/orgunit",
        description: "Edit the core meta-data associated with the orgunit.",
        },
        // {type: "contracts", sort_field: "", model: "", id_column: "", form_path: "./forms/contracts",
        // description: "Edit the contract data associated with the orgunit.",
        // },        
        {type: "ownerteams", sort_field: "dim_Ownerteam_Ownerteam", model: "Dimension_Ownerteam", id_column: "dim_Ownerteam_pk", form_path: "./forms/ownerteams",
        description: "Edit the resolver type of ownerteams associated with this orgunit. This is needed to help attribute tickets to customer, third party or Littlefish resolver teams.",
        queries: {sql: [
            {name: "lf_resolvers", query: "SELECT * FROM [DIMENSION_Ownerteam_LF_Resolver_Types]"}
        ]}
        },
        // {type: "measurements", sort_field: "", model: "", id_column: "", form_path: "./forms/measurements",
        // description: "Edit the measurements like SLAs and KPIs associated with the orgunit. These measurements will appear within Service Reports, the SLA dashboard as well as other areas of the business.",
        // },        
        ]        

      return route_info
}


//  #####  ####### #######          #    #       #       
// #     # #          #            # #   #       #       
// #       #          #           #   #  #       #       
// #  #### #####      #    ##### #     # #       #       
// #     # #          #          ####### #       #       
// #     # #          #          #     # #       #       
//  #####  #######    #          #     # ####### ####### 
                                                      

exports.getAll = async(req,res) => {

    let find_list = []
    find_list.push(
    {
        model: "Dimension_Orgunit",
        search_type: "findAll",
        params: [{		
        }]
    }) 

    try{
        let orgunits = await utils.queries.findData(find_list)
        let view = "client_data/index"
        res.render(view, {title:"Client Data", stylesheet: view, orgunits:orgunits[0]});
    }
    catch(err){
        console.log(err)
        req.flash("error", "There was an error trying to get report data");
        res.redirect("/")        
    }
};



//  #####  ####### #######        #####  ### #     #  #####  #       ####### 
// #     # #          #          #     #  #  ##    # #     # #       #       
// #       #          #          #        #  # #   # #       #       #       
// #  #### #####      #    #####  #####   #  #  #  # #  #### #       #####   
// #     # #          #                #  #  #   # # #     # #       #       
// #     # #          #          #     #  #  #    ## #     # #       #       
//  #####  #######    #           #####  ### #     #  #####  ####### #######

exports.getSingle = async(req,res) => {
    
    let id = req.params.clientid;
    let route_info = exports.getRouteInfo();

    let find_list = []
    find_list.push(
    {
        model: "Dimension_Orgunit",
        search_type: "findOne",
        params: [{
            where: {
                dim_orgunit_pk: id,
            },
            include: utils.queries.searchType['OrgUnit'].include			
        }]
    }) 

    try{
        let orgunit = await utils.queries.findData(find_list)
        let view = "client_data/show"
        res.render(view, {title:orgunit.name, stylesheet: view, route_info:route_info, orgunit:orgunit[0]});
    }
    catch(err){
        console.log(err)
        req.flash("error", "There was an error trying to get report data");
        res.redirect("/")        
    }
};


//  #####  ####### #######       ####### ######  ### ####### 
// #     # #          #          #       #     #  #     #    
// #       #          #          #       #     #  #     #    
// #  #### #####      #    ##### #####   #     #  #     #    
// #     # #          #          #       #     #  #     #    
// #     # #          #          #       #     #  #     #    
//  #####  #######    #          ####### ######  ###    #  

exports.getEdit = async(req,res) => {
    
    let id = req.params.clientid;
    let item = req.params.item;
    let route_info = exports.getRouteInfo();

    let find_list = []
    find_list.push(
    {
        model: "Dimension_Orgunit",
        search_type: "findOne",
        params: [{
            where: {
                dim_orgunit_pk: id,
            },
            include: utils.queries.searchType['OrgUnit'].include			
        }]
    }) 

    try{
        let orgunit = await utils.queries.findData(find_list)
        let view = "client_data/edit"
        let type_info;
        route_info.forEach((route) => {
            if(route.type === item){
                type_info = route;
            }
        })

        //IF THERE'S ORGUNIT SUB DATA, FIND IT AND SORT IT IF A SORT FIELD KEY IS PROVIDED
        let data = orgunit[0][item];
        if(data){
            //SORT THE OUTPUT DATA IF WE'VE PROVIDED A FIELD
            if(type_info.sort_field){
                data.sort((a, b) => {
                    if ( a[type_info.sort_field] < b[type_info.sort_field] ){
                        return -1;
                    }
                    if ( a[type_info.sort_field] > b[type_info.sort_field] ){
                        return 1;
                    }
                    return 0;
                })
            }
        }

        //CHECK TO SEE IF THERE'S ANY DATA THAT NEEDS QUERYING
        let queried_data = {};
        if(type_info.queries){
            if(type_info.queries.sql){

                let output = await utils.queries.runDBQueries(type_info.queries.sql);

                queried_data["sql"] = {
                    definitions: type_info.queries.sql,
                    output: output
                }
            }
        }

        // let query = type_info.queries[0]
        // queried_data[query.name] = await utils.queries.runDBQueries(type_info.queries)

        res.render(view, {title:orgunit.name, route_info:type_info, orgunit:orgunit[0], data:orgunit[0][item], queries: queried_data});
    }
    catch(err){
        console.log(err)
        req.flash("error", "There was an error trying to get report data");
        res.redirect("/")        
    }
};



// #     # ######  ######     #    ####### ####### 
// #     # #     # #     #   # #      #    #       
// #     # #     # #     #  #   #     #    #       
// #     # ######  #     # #     #    #    #####   
// #     # #       #     # #######    #    #       
// #     # #       #     # #     #    #    #       
//  #####  #       ######  #     #    #    ####### 

exports.updateParent = async(req,res) => { 

    let id = Number(req.params.clientid)    

    //MAY NEED TO PASS ITEM HERE BUT IT'S NOT CRUCUAL

    //USE ID TO GET PARENT

    //UPDATE UPDATE TO PASS PARAMETERS TO PARENT AND SAVE

}

exports.updateMultipleChildren = async(req,res) => { 

    let id = Number(req.params.clientid)    
    let item = req.params.item;

    try{
        let route_info = exports.getRouteInfo()
    
        let type_info;
        route_info.forEach((route) => {
            if(route.type === item){
                type_info = route;
            }
        })
    
    
    
        let update_list = []
    
        let data = {
            model: type_info.model,
            params: []
        };
    
    
        req.body.params.forEach((param_item) => {
    
            let param = {
                update_info: {},
                where_info: {
                    returning: true,
                    where: {}
                }
            }
    
            for(const key in param_item){
                if(key === type_info.id_column){
                    param.where_info.where[key] = param_item[key]
                }
                else{
                    param.update_info[key] = param_item[key]
                }
            }
            data.params.push(param)
    
        })
        update_list.push(data)
    
        let updated = await utils.queries.updateWhere(update_list)
    
        req.flash("success", "Client "+item+" Data Updated"); 
        res.redirect("/client_data/"+id+'/'+item+'/edit')
    }catch(error){
        req.flash("error", "There was an error while trying to save "+item+" Data");
        res.redirect("/client_data/"+id+'/'+item+'/edit')
    }


};