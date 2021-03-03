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

exports.createData = async(creation_list) => {

    let promises = [];

    creation_list.forEach((list) => {
        list.params.forEach((item) => {
            promises.push(models[list.model].findOrCreate(item))
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