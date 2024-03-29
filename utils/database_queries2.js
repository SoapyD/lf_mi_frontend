const models = require("../models");
const databaseUtil = require('../utils/database')


exports.searchType = {

    "Full Report": {
        include: [
            {
                model: models.Section, 
                as: "sections",
                include: [
                    {
                        model: models.SubSection, 
                        as: "subsections",
                        through: {
                            model: models.SectionSubSection,
                            as: "sectionsubsections"
                        },
                        include: [
                            {
                                model: models.Parameter, 
                                as: "parameters",
                                through: {
                                    model: models.SubSectionParameter,
                                    as: "subsectionparameters"
                                }
                            }
                        ]
                    }
                ]
            },
            {
                model: models.Subscription, 
                as: "subscriptions",             
                include: [
                    {
                        model: models.Frequency, 
                        as: "frequency"
                    },
                    {
                        model: models.SubscriptionActivity, 
                        as: "subscriptionactivities",
                        limit: 1,
                        order: [["createdAt", "DESC"]]
                    }                    
                ]
            }, 
        ]        
    },
    "SubSection": {
        include: [
            {
                model: models.Parameter, 
                as: "parameters",
                through: {
                    model: models.SubSectionParameter,
                    as: "subsectionparameters"
                }
            }
        ]        
    },
    "OrgUnit": {
        include: [
            {
                model: models.Dimension_Ownerteam, 
                as: "ownerteams",
            },
            {
                model: models.Dimension_Orgunit_Contract, 
                as: "contracts",
            },
            {
                model: models.DIMENSION_Measurement_Org_Measurements, 
                as: "measurements",

                include: [
                    {
                        model: models.DIMENSION_Measurement_Definitions, 
                        as: "definition",
                    },           
                ]                  
            }             
        ]  
    },
    "PeopleHR_Employee": {
        include: [
            {
                model: models.Dimension_Agentlink, 
                as: "agentlinks",
            },           
        ]  
    }
}


//USE THE BELOW IF YOU WANT TO FILTER ANY INCLUDES, NEED TO SAY "REQUIRED = FALSE" TO MAKE IT A LEFT OUTER JOIN
// where: {
//     dim_measurement_org_measurements_active: 1
// },
// required: false,



//  #####  ######  #######    #    ####### #######       ######  #######  #####  ####### ######  ######  
// #     # #     # #         # #      #    #             #     # #       #     # #     # #     # #     # 
// #       #     # #        #   #     #    #             #     # #       #       #     # #     # #     # 
// #       ######  #####   #     #    #    #####   ##### ######  #####   #       #     # ######  #     # 
// #       #   #   #       #######    #    #             #   #   #       #       #     # #   #   #     # 
// #     # #    #  #       #     #    #    #             #    #  #       #     # #     # #    #  #     # 
//  #####  #     # ####### #     #    #    #######       #     # #######  #####  ####### #     # ######  

exports.createData = async(creation_list, search_type="findOrCreate") => {

    let promises = [];

    creation_list.forEach((list) => {
        list.params.forEach((item) => {
            promises.push(models[list.model][search_type](item))
            // promises.push(models[list.model].create(item))
        })
    })

    return Promise.all(promises)
    .catch((err) => {
        console.log(err)
    })  
}

exports.createData2 = async(creation_list) => {
    
    //check records are there
    let checks = await exports.checkRecordsNull(creation_list)
    let created = await exports.createRecord(creation_list, checks)
    return created
}

exports.createRecord = async(creation_list, checks) => {
    let promises = [];

    let i = 0;
    creation_list.forEach( async(list) => {
        list.params.forEach( async(item) => {
    
            //IF ITEM DOESN'T EXIST, CREATE IT            
            promises.push(models[list.model].create(item))
            // if(checks[i][0] === null){
            //     promises.push(models[list.model].create(item))
            // }
            // else{
            //     let searchcriteria = {
            //         where: item
            //     }
                
            //     promises.push(models[list.model].findOne(searchcriteria))
            // }

            i++;
        })
    })

    return Promise.all(promises)
    .catch((err) => {
        console.log(err)
    })  
}

//  #####  #     # #######  #####  #    #       ######  #######  #####  ####### ######  ######   #####        #     # #     # #       #       
// #     # #     # #       #     # #   #        #     # #       #     # #     # #     # #     # #     #       ##    # #     # #       #       
// #       #     # #       #       #  #         #     # #       #       #     # #     # #     # #             # #   # #     # #       #       
// #       ####### #####   #       ###    ##### ######  #####   #       #     # ######  #     #  #####  ##### #  #  # #     # #       #       
// #       #     # #       #       #  #         #   #   #       #       #     # #   #   #     #       #       #   # # #     # #       #       
// #     # #     # #       #     # #   #        #    #  #       #     # #     # #    #  #     # #     #       #    ## #     # #       #       
//  #####  #     # #######  #####  #    #       #     # #######  #####  ####### #     # ######   #####        #     #  #####  ####### ####### 
                                                                                                                                           

exports.checkRecordsNull = async(creation_list) => {

    let promises = [];

    creation_list.forEach( async(list) => {
        list.params.forEach( async(item) => {

            let findlist = []

            let search_criteria = {
                model: list.model,
                search_type: "findOne",
                params: [
                    {
                        where: item
                    }
                ]
            }     
            findlist.push(search_criteria)       

            promises.push(exports.findData(findlist))
        })
    })

    return Promise.all(promises)
    .catch((err) => {
        console.log(err)
    })       
}


// ####### ### #     # ######        ######     #    #######    #    
// #        #  ##    # #     #       #     #   # #      #      # #   
// #        #  # #   # #     #       #     #  #   #     #     #   #  
// #####    #  #  #  # #     # ##### #     # #     #    #    #     # 
// #        #  #   # # #     #       #     # #######    #    ####### 
// #        #  #    ## #     #       #     # #     #    #    #     # 
// #       ### #     # ######        ######  #     #    #    #     # 

exports.findData = async(find_list) => {

    let promises = [];

    try{
        find_list.forEach((list) => {
    
            if (list.params)
            {
                list.params.forEach((item) => {
                    promises.push(models[list.model][list.search_type](item))
                })
            }
            else{
                promises.push(models[list.model][list.search_type]())
            }
        })
    
        return Promise.all(promises)
        .catch((err) => {
            console.log(err)
        })    
    }catch(e){
        console.log("Error Trying to Find Data")
        return []
    }
}


// ######  #     # #     #       ######  ######         #####  #     # ####### ######  ### #######  #####  
// #     # #     # ##    #       #     # #     #       #     # #     # #       #     #  #  #       #     # 
// #     # #     # # #   #       #     # #     #       #     # #     # #       #     #  #  #       #       
// ######  #     # #  #  # ##### #     # ######  ##### #     # #     # #####   ######   #  #####    #####  
// #   #   #     # #   # #       #     # #     #       #   # # #     # #       #   #    #  #             # 
// #    #  #     # #    ##       #     # #     #       #    #  #     # #       #    #   #  #       #     # 
// #     #  #####  #     #       ######  ######         #### #  #####  ####### #     # ### #######  #####  

exports.runDBQueries = async(query_array) => {

    try{
        let promises = [];

        query_array.forEach((item) => {
            if(item.query && item.query !== ""){
                promises.push(databaseUtil.runQuery(item.query))    
            }
            else{
                promises.push([])
            }
        })

        return Promise.all(promises)
        .catch((err) => {
            console.log(err)
        })      
    }catch(e){
        console.log("Error Trying to Find Data")
        return []
    }
}


// #     # ######  ######     #    ####### #######       ######     #    #######    #    
// #     # #     # #     #   # #      #    #             #     #   # #      #      # #   
// #     # #     # #     #  #   #     #    #             #     #  #   #     #     #   #  
// #     # ######  #     # #     #    #    #####   ##### #     # #     #    #    #     # 
// #     # #       #     # #######    #    #             #     # #######    #    ####### 
// #     # #       #     # #     #    #    #             #     # #     #    #    #     # 
//  #####  #       ######  #     #    #    #######       ######  #     #    #    #     # 

exports.updateData = async(item, update_list) => {
    try{
        let promises = [];

        update_list.forEach((list) => {

            list.params.forEach((param_item) => {
                for(const key in param_item){
                    item[key] = param_item[key]
                }
            })
            promises.push(item.save())
        })  
        
        return Promise.all(promises)
        .catch((err) => {
            console.log(err)
        })      

    }catch(e){
        console.log("Error Trying to Find Data")
        return []
    }    
}


exports.updateWhere = async(list) => {

    try{
        let promises = [];

        list.forEach((item) => {

            item.params.forEach((param) => {
                promises.push(models[item.model].update(param.update_info,param.where_info))

            })
            
        })  
        
        return Promise.all(promises)
        .catch((err) => {
            console.log(err)
        })      
    }catch(e){
        console.log("Error Trying to Find Data")
        return []
    }        
}



// ######  #######  #####  ####### ######  ####### #     #       ######     #    #######    #    
// #     # #       #     #    #    #     # #     #  #   #        #     #   # #      #      # #   
// #     # #       #          #    #     # #     #   # #         #     #  #   #     #     #   #  
// #     # #####    #####     #    ######  #     #    #    ##### #     # #     #    #    #     # 
// #     # #             #    #    #   #   #     #    #          #     # #######    #    ####### 
// #     # #       #     #    #    #    #  #     #    #          #     # #     #    #    #     # 
// ######  #######  #####     #    #     # #######    #          ######  #     #    #    #     # 

exports.destroyData = async(destroy_list) => {

    try{
        let promises = [];

        destroy_list.forEach((list) => {

            list.params.forEach((item) => {
                promises.push(models[list.model].destroy(item))
            })
        })  

        return Promise.all(promises)
        .catch((err) => {
            console.log(err)
        })     
    }catch(e){
        console.log("Error Trying to Find Data")
        return []
    } 
}