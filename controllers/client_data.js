

const utils = require("../utils");
const Op = require("sequelize").Op


exports.getRouteInfo = () => {

    let route_info;

    //form_create_path: "./forms/new_measurements",

    route_info = [
        {type: "orgunit", sort_field: "dim_orgunit_orgunt", model: "Dimension_Orgunit", id_column: "dim_orgunit_pk", form_path: "./forms/orgunit",
        description: "Edit the core meta-data associated with the orgunit.",
        queries: {sql: [
            {name: "sdms", 
            query: `
            SELECT
            [First Name]+' '+[Last Name] as dim_user_cleaned
            FROM 
            [dbo].[ADF_PeopleHR_Employee]
            WHERE 
            [job role] = 'SERVICE DELIVERY MANAGER' AND [Work Email] IS NOT NULL
            AND 
            (
            [Final Day of Employment] >= getdate()
            or
            [Final Day of Employment] IS NULL
            )
            order by
            dim_user_cleaned
            `},
            {name: "pods", 
            query: `
            SELECT distinct
            [dim_Ringcentral_Teams_teamName]
            FROM [dbo].[DIMENSION_Ringcentral_Teams]
            WHERE 
            dim_Ringcentral_Teams_teamName IS NOT NULL
            AND dim_Ringcentral_Teams_teamName NOT IN 
            ('DefaultTeam','Operations Team','Service Desk Team Leaders','SOC')
            ORDER BY
            [dim_Ringcentral_Teams_teamName]
            `}            
        ]}
        },
        {type: "measurements", sort_field: "", model: "DIMENSION_Measurement_Org_Measurements", id_column: "dim_measurement_org_measurements_pk", form_path: "./forms/measurements", form_create_path: "./forms/new_measurements", 
        description: "View  the measurements like SLAs and KPIs associated with the orgunit. These measurements will appear within Service Reports, the SLA dashboard as well as other areas of the business.",
        queries: {sql: [
            {name: "measurement_definitions", 
            query: 
            `
            SELECT 
            dim_measurement_definitions_pk
            ,dim_measurement_definitions_name
            ,t.dim_measurement_type_cleaned
            FROM 
            [DIMENSION_Measurement_Definitions] i
            LEFT JOIN DIMENSION_Measurement_Type t ON (t.dim_measurement_type_pk = i.dim_measurement_definitions_measurement_type_fk)
            ORDER BY t.dim_measurement_type_cleaned, dim_measurement_definitions_name ASC          
            `}
        ]},
        post_queries:{sql: [
            {
                name: "refresh fact tables",
                query: "UPDATE fact_table_processlist SET REFRESH = 'Y' WHERE stored_procedure IN ('fb_measurements','fb_measurements_snapshot')"
            },
            {
                name: "update orgunit and measurement FKs",
                query: 
                `
                --UPDATE DIMENSION_Measurement_Org_Measurements TO ADD IN FK FOR ORGUNIT TABLE
                UPDATE DIMENSION_Measurement_Org_Measurements
                SET
                dim_orgunit_fk  = org.dim_orgunit_pk
                FROM 
                DIMENSION_Measurement_Org_Measurements o
                JOIN DIMENSION_orgunit org ON (org.dim_orgunit_cleaned = o.dim_measurement_org_measurements_orgunit)
                where
                dim_orgunit_fk IS NULL
                
                --UPDATE DIMENSION_Measurement_Org_Measurements TO ADD IN FK FOR DEFINITIONS TABLE
                UPDATE DIMENSION_Measurement_Org_Measurements
                SET
                dim_measurement_definitions_fk  = def.dim_measurement_definitions_pk
                FROM 
                DIMENSION_Measurement_Org_Measurements o
                JOIN DIMENSION_Measurement_Definitions def ON (def.dim_measurement_definitions_name = o.dim_measurement_org_measurements_name)
                where
                dim_measurement_definitions_fk IS NULL                
                `
            }      
        ]},
        },         
        {type: "contracts", sort_field: "dim_orgunit_contract_name", model: "Dimension_Orgunit_Contract", id_column: "dim_orgunit_contract_pk", form_path: "./forms/contracts", form_create_path: "./forms/new_contracts",
        description: "Edit the contract data associated with the orgunit. This data is needed for finance reporting.",
        stylesheet: "contracts"
        },        
        {type: "ownerteams", sort_field: "dim_Ownerteam_Ownerteam", model: "Dimension_Ownerteam", id_column: "dim_Ownerteam_pk", form_path: "./forms/ownerteams",
        description: "Edit the resolver type of ownerteams associated with this orgunit. This is needed to help attribute tickets to customer, third party or Littlefish resolver teams.",
        queries: {sql: [
            {name: "lf_resolvers", query: "SELECT * FROM [DIMENSION_Ownerteam_LF_Resolver_Types]"}
        ]}        
        },       
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
    if(req.user.role === "App_Admin" || req.user.role === "ClientData_Admin")
    {
        find_list.push(
            {
                model: "Dimension_Orgunit",
                search_type: "findAll",
                params: [{         
                }]
            }) 
    }else{
        //IF THE USER ISN'T AN ADMIN, CHECK TO SEE WHAT ORGUNITS ARE ASSOCIATED WITH THEM
        find_list.push(
        {
            model: "Dimension_Orgunit",
            search_type: "findAll",
            params: [{
                where: {
                    [Op.or]: [{dim_orgunit_accountmanagername: user_name}, {dim_orgunit_servicedeliverymanager: user_name}],
                    dim_orgunit_active: 1,
                    dim_orgunit_client: 1,
                },            
            }]
        }) 
    }

    try{
        let orgunits = await utils.queries.findData(find_list)
        let data = orgunits[0]
        data.sort((a, b) => {
            if ( a['dim_orgunit_orgunit'] < b['dim_orgunit_orgunit'] ){
                return -1;
            }
            if ( a['dim_orgunit_orgunit'] > b['dim_orgunit_orgunit'] ){
                return 1;
            }
            return 0;
        })


        let view = "client_data/index"
        res.render(view, {title:"Client Data", stylesheet: view, orgunits:data});
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
        let data = orgunit[0];


        let view = "client_data/show"
        res.render(view, {title:data.dim_orgunit_orgunit, stylesheet: view, route_info:route_info, orgunit:data});
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

        let view = "client_data/new"
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

                let output = await utils.queries.runDBQueries(type_info.queries.sql);

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
	
    let id = req.params.clientid;
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
    
        let data = await utils.queries.createData2(creation_list)	
    

        //CHECK TO SEE IF THERE'S ANY POST SCRIPTS THAT NEED TO BE RUN
        if(type_info.post_queries){
            if(type_info.post_queries.sql){

                let output = await utils.queries.runDBQueries(type_info.post_queries.sql);
            }
        }

        req.flash("success", 'Record Successfully Created!');
        res.redirect("/client_data/"+id+'/'+type_info.type+'/edit')	
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
    
    let id = req.params.clientid;
    let item = req.params.item;
    let route_info = exports.getRouteInfo();

    try{

        let find_list = []
        find_list.push(
        {
            model: "Dimension_Orgunit",
            search_type: "findOne",
            params: [{
                where: {
                    dim_orgunit_pk: id
                },
                include: utils.queries.searchType['OrgUnit'].include			
            }]
        }) 
    
        // if(type_info.filters){
        //     type_info.filters.forEach((filter)=> {
        //         let key = Object.keys(filter)[0];
        //         find_list[0].params[0].where[key] = filter[key];
        //     })
        // }           

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

        let context = {title:type_info.type, route_info:type_info, orgunit:orgunit[0], data:orgunit[0][item], queries: queried_data}
        if(type_info.stylesheet){
            context.stylesheet = 'client_data/'+type_info.stylesheet;
        }

        res.render(view, context);
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

    let id = Number(req.params.clientid)  
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
        let orgunits = await utils.queries.findData(findlist)


        let updatelist = []
        updatelist.push({
            params: [
                params
            ]
        })    

        //UPDATE THE RECORD
        let data = await utils.queries.updateData(orgunits[0], updatelist)
        req.flash("success", "Client Data Updated"); 
        res.redirect("/client_data/"+id+'/orgunit/edit')   
    }	
    catch(err){
        console.log(err)
        req.flash("error", "There was an error trying to update your data");
        res.redirect("/client_data/"+id+'/orgunit/edit')        
    }	

    //MAY NEED TO PASS ITEM HERE BUT IT'S NOT CRUCUAL

    //USE ID TO GET PARENT

    //UPDATE UPDATE TO PASS PARAMETERS TO PARENT AND SAVE

}

exports.updateMultipleChildren = async(req,res) => { 

    let id = Number(req.params.clientid)    
    let item = req.params.item;
    let params =  req.body.params;

    try{

        //NULL ALL BLANK ITEMS
        params.forEach((param, i) => {
            for(const key in param){
                if(params[i][key] === ''){
                    params[i][key] = null
                }
            }
        })


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
    
    
        let where_set = false
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
                    where_set = true
                }
                else{
                    param.update_info[key] = param_item[key]
                }
            }
            data.params.push(param)
    
        })
        update_list.push(data)
    
        if(where_set === true){
            let updated = await utils.queries.updateWhere(update_list)
    

            //CHECK TO SEE IF THERE'S ANY POST SCRIPTS THAT NEED TO BE RUN
            if(type_info.post_queries){
                if(type_info.post_queries.sql){

                    let output = await utils.queries.runDBQueries(type_info.post_queries.sql);
                }
            }

            req.flash("success", "Client "+item+" Data Updated"); 
            res.redirect("/client_data/"+id+'/'+item+'/edit')
    
        }else{
            req.flash("error", "Where clause not set correctly")
            res.redirect("/client_data/"+id+'/'+item+'/edit')            
        }
     }catch(error){
        console.log(error)
        req.flash("error", "There was an error while trying to save "+item+" Data");
        res.redirect("/client_data/"+id+'/'+item+'/edit')
    }


};