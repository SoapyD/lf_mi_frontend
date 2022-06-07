

const utils = require("../utils");
const Op = require("sequelize").Op


exports.getRouteInfo = () => {

    let route_info;

    route_info = [
        {type: "agentlinks", sort_field: "dim_agentlink_system", model: "DIMENSION_Agent_Link_v2", id_column: "dim_agent_link_pk"
        , form_path: "./forms/agentlinks",
        description: "Edit the user logins associated with People HR data.",
        // queries: {sql: [
        //     {name: "users", 
        //     query: `
        //     SELECT
        //     *
        //     FROM 
        //     [dbo].[DIMENSION_User]
        //     order by
        //     dim_user_cleaned
        //     `},         
        // ]}
        },
        // {type: "contracts", sort_field: "dim_orgunit_contract_name", model: "Dimension_Orgunit_Contract", id_column: "dim_orgunit_contract_pk", form_path: "./forms/contracts", form_create_path: "./forms/new_contracts",
        // description: "Edit the contract data associated with the orgunit. This data is needed for finance reporting.",
        // },        
        // {type: "ownerteams", sort_field: "dim_Ownerteam_Ownerteam", model: "Dimension_Ownerteam", id_column: "dim_Ownerteam_pk", form_path: "./forms/ownerteams",
        // description: "Edit the resolver type of ownerteams associated with this orgunit. This is needed to help attribute tickets to customer, third party or Littlefish resolver teams.",
        // queries: {sql: [
        //     {name: "lf_resolvers", query: "SELECT * FROM [DIMENSION_Ownerteam_LF_Resolver_Types]"}
        // ]}        
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

    //GET PEOPLE HR DATA

    let user_email = req.user.id_name
    let user_name = user_email.split("@");
    user_name = user_name[0].replace(".", " "); //take the left hand side of the email
    // user_name = 'marc digby'

    let find_list = []

    //RETURN ALL ENTRIES IF THIS IS AN ADMIN
    if(req.user.role === "App_Admin" || req.user.role === "UserData_Admin")
    {
        find_list.push(
            {
                model: "DETAIL_PeopleHR_Employee",
                search_type: "findAll",
                params: [{         
                }]
            }) 
    }else{
        //IF THE USER ISN'T AN ADMIN, CHECK TO SEE WHAT ORGUNITS ARE ASSOCIATED WITH THEM
        find_list.push(
        {
            model: "DETAIL_PeopleHR_Employee",
            search_type: "findAll",
            params: [{
                // where: {
                //     [Op.or]: [{dim_orgunit_accountmanagername: user_name}, {dim_orgunit_servicedeliverymanager: user_name}],
                //     dim_orgunit_active: 1,
                //     dim_orgunit_user: 1,
                // },            
            }]
        }) 
    }

    try{
        let returned_data = await databaseHandler.findData(find_list)
        let data = returned_data[0]

        data = utils.functions.sortDynamic(data,'LastName',is_number=false)


        let view = "user_data/index"
        res.render(view, {title:"User Data", stylesheet: view, users_data:data});
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
    
    let id = req.params.userid;
    let route_info = exports.getRouteInfo();

    let find_list = []
    find_list.push(
    {
        model: "DETAIL_PeopleHR_Employee",
        search_type: "findOne",
        params: [{
            where: {
                ID: id,
            },
            include: databaseHandler.searchType['PeopleHR_Employee'].include			
        }]
    }) 

    try{
        let user = await databaseHandler.findData(find_list)
        let data = user[0];


        let view = "user_data/show"
        res.render(view, {title:data.FirstName+' '+data.LastName, stylesheet: view, route_info:route_info, user_data:data});
    }
    catch(err){
        console.log(err)
        req.flash("error", "There was an error trying to get report data");
        res.redirect("/")        
    }
};



//  #####  ####### #######       ####### ####### ######  #     #        #####  ######  #######    #    ####### ####### 
// #     # #          #          #       #     # #     # ##   ##       #     # #     # #         # #      #    #       
// #       #          #          #       #     # #     # # # # #       #       #     # #        #   #     #    #       
// #  #### #####      #    ##### #####   #     # ######  #  #  # ##### #       ######  #####   #     #    #    #####   
// #     # #          #          #       #     # #   #   #     #       #       #   #   #       #######    #    #       
// #     # #          #          #       #     # #    #  #     #       #     # #    #  #       #     #    #    #       
//  #####  #######    #          #       ####### #     # #     #        #####  #     # ####### #     #    #    ####### 

exports.getFormCreate = async(req,res) => { 

    let id = req.params.userid;
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
            include: databaseHandler.searchType['OrgUnit'].include			
        }]
    }) 

    try{
        let orgunit = await databaseHandler.findData(find_list)

        let view = "user_data/new"
        let type_info;
        route_info.forEach((route) => {
            if(route.type === item){
                type_info = route;
            }
        })    

        //CHECK TO SEE IF THERE'S ANY DATA THAT NEEDS QUERYING
        let queried_data = {};
        if(type_info.queries){
            if(type_info.queries.sql){

                let output = await databaseHandler.runDBQueries(type_info.queries.sql);

                queried_data["sql"] = {
                    definitions: type_info.queries.sql,
                    output: output
                }
            }
        }


        res.render(view, {title:type_info.type, route_info:type_info, orgunit:orgunit[0], queries: queried_data});
    }
    catch(err){
        console.log(err)
        req.flash("error", "There was an error trying to get data");
        res.redirect("/")        
    }    
};

//  #####  ######  #######    #    ####### ####### 
// #     # #     # #         # #      #    #       
// #       #     # #        #   #     #    #       
// #       ######  #####   #     #    #    #####   
// #       #   #   #       #######    #    #       
// #     # #    #  #       #     #    #    #       
//  #####  #     # ####### #     #    #    ####### 

exports.create = async(req,res) => {
	
    let id = req.params.userid;
    let item = req.params.item;
    let route_info = exports.getRouteInfo();
    let params =  req.body.params;

    //NULL ALL BLANK ITEMS
    for(const key in params){
        if(params[key] === ''){
            params[key] = null
        }
    }

    let type_info;
    route_info.forEach((route) => {
        if(route.type === item){
            type_info = route;
        }
    })    
    
    try{
        let creation_list = []
        creation_list.push(
        {
            model: type_info.model, 
            params: [
                req.body.params
            ]
        }) 
    
        let data = await databaseHandler.createData2(creation_list)	
    
        res.redirect("/user_data/"+id+'/'+type_info.type+'/edit')	
    }
    catch(err){
        console.log(err)
        req.flash("error", "There was an error trying to create data");
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
    
    let id = req.params.userid;
    let item = req.params.item;
    let route_info = exports.getRouteInfo();

    let find_list = []
    find_list.push(
    {
        model: "DETAIL_PeopleHR_Employee",
        search_type: "findOne",
        params: [{
            where: {
                ID: id,
            },
            include: databaseHandler.searchType['PeopleHR_Employee'].include			
        }]
    }) 

    try{
        let user = await databaseHandler.findData(find_list)
        let view = "user_data/edit"
        let type_info;
        route_info.forEach((route) => {
            if(route.type === item){
                type_info = route;
            }
        })

        //IF THERE'S ORGUNIT SUB DATA, FIND IT AND SORT IT IF A SORT FIELD KEY IS PROVIDED
        let data = user[0][item];
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

                let output = await databaseHandler.runDBQueries(type_info.queries.sql);

                queried_data["sql"] = {
                    definitions: type_info.queries.sql,
                    output: output
                }
            }
        }

        // let query = type_info.queries[0]
        // queried_data[query.name] = await databaseHandler.runDBQueries(type_info.queries)

        res.render(view, {title:type_info.type, stylesheet: view, route_info:type_info, user_data:user[0], data:user[0][item], queries: queried_data});
    }
    catch(err){
        console.log(err)
        req.flash("error", "There was an error trying to get data");
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

    let id = Number(req.params.userid)  
    let params =  req.body.params;

    try{
        //NULL ALL BLANK ITEMS
        for(const key in params){
            if(params[key] === ''){
                params[key] = null
            }
        }

        let findlist = []
        findlist.push({
            model: "Dimension_Orgunit",
            search_type: "findOne",
            params: [
                {
                    where: {
                        dim_orgunit_pk: id
                    }
                }
            ]
        })

        //GET THE EDITABLE ITEM, INCLUDING ANY JOINS
        let orgunits = await databaseHandler.findData(findlist)


        let updatelist = []
        updatelist.push({
            params: [
                params
            ]
        })    

        //UPDATE THE RECORD
        let data = await databaseHandler.updateData(orgunits[0], updatelist)
        req.flash("success", "User Data Updated"); 
        res.redirect("/user_data/"+id+'/orgunit/edit')   
    }	
    catch(err){
        console.log(err)
        req.flash("error", "There was an error trying to update your data");
        res.redirect("/user_data/"+id+'/orgunit/edit')        
    }	

    //MAY NEED TO PASS ITEM HERE BUT IT'S NOT CRUCUAL

    //USE ID TO GET PARENT

    //UPDATE UPDATE TO PASS PARAMETERS TO PARENT AND SAVE

}

exports.updateMultipleChildren = async(req,res) => { 

    let id = Number(req.params.userid)    
    let item = req.params.item;
    let params =  req.body.params;

    //NULL ALL BLANK ITEMS
    params.forEach((param, i) => {
        for(const key in param){
            if(params[i][key] === ''){
                params[i][key] = null
            }
        }
    })


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
    
    
        params.forEach((param_item) => {
    
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
    
        let updated = await databaseHandler.updateWhere(update_list)
    
        req.flash("success", "User "+item+" Data Updated"); 
        res.redirect("/user_data/"+id+'/'+item+'/edit')
    }catch(error){
        console.log(error)
        req.flash("error", "There was an error while trying to save "+item+" Data");
        res.redirect("/user_data/"+id+'/'+item+'/edit')
    }


};