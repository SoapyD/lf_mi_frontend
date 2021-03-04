const models = require("../models");
// const database = require('../util/database')


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
            }      
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
    }
}

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

exports.createData2 = async(type, creation_list) => {
    
    //check records are there
    let checks = await exports.createRecordsNull(type, creation_list)
    let created = await exports.createRecord(type, creation_list, checks)
    return created
}

exports.createRecord = async(type, creation_list, checks) => {
    let promises = [];

    let i = 0;
    creation_list.forEach( async(list) => {
        list.params.forEach( async(item) => {
    

            if(checks[i][0] === null){
                promises.push(models[list.model].create(item))
            }

            i++;
        })
    })

    return Promise.all(promises)
    .catch((err) => {
        console.log(err)
    })  
}

exports.createRecordsNull = async(type, creation_list) => {

    let promises = [];

    creation_list.forEach( async(list) => {
        list.params.forEach( async(item) => {

            let findlist = []

            let search_criteria = {
                model: type,
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



exports.findData = async(find_list) => {

    let promises = [];

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
}

exports.updateData = async(item, update_list) => {

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
}


exports.destroyData = async(destroy_list) => {

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
}