const Report = require("../models/report");
const Fusion = require("../models/fusion");
const Section = require("../models/section");
const SubSection = require("../models/subsection");
const Frequency = require("../models/frequency");
const Parameter = require("../models/parameter");
const Subscription = require("../models/subscription");
const SubscriptionActivity = require("../models/subscription_activity");

const Database = require("./database");
// const report = require("mssql-ssrs");


///////////////////////////////////////////////////////////////////REPORTS

exports.getAllReports = () => {

    return Report.findAll({
        order: [ [ 'name', 'ASC' ]]
    })   
    .catch((err) =>{
        return
    })       
}

exports.getReport = (report_id=-1, name="") => {

    if (report_id != -1){
        return Report.findByPk(report_id)  
        .catch((err) =>{
            return
        })           
    } else {
        return item[0] = Report.findOne({
            where: {
                name: name
            }
        })          
        .catch((err) =>{
            return
        })           
    }
}

exports.copyReport = async(user_id, report_id, result) => {

    let report = result[0];
    let subsection_fusions = result[1];
    let subsections = result[2];
    let parameters = result[3];

    let new_report = await Report.create ({
        name: report.name + ' - Copy'
        ,description: report.description
        ,owner: user_id
    })

    let fusion_ids = []
    subsection_fusions.forEach((subsection, i) => {
        fusion_ids.push(subsection.join_from_id);
    })

    let new_subsection_fusions = exports.recreateSubSectionFusions(new_report.id, fusion_ids)

    return Promise.all([new_report, new_subsection_fusions])
    // })       
    // .catch((err) =>{
    //     return
    // })      
    
   
}

exports.destroyReport = (report_id) => {    
    return report = Report.destroy({
        where: {
            id: report_id
        }
    })
    .catch((err) =>{
        return
    })       
}

exports.dropReports = () => {
    return Report.drop()
    .catch((err) =>{
        return
    })          
}

///////////////////////////////////////////////////////////////////FUSIONS

exports.createFusion = (i, join_from_id, join_from, join_to_id, join_to) => {

    return Fusion.findOrCreate({
    where: {
        order: i      
        ,join_from_id: join_from_id
        ,join_from: join_from                                                  
        ,join_to_id: join_to_id
        ,join_to: join_to                                   
    }})
    .catch((err) =>{
        return
    })   
}

exports.createFusionsFromBody = (fusion_to, item, fusions) => {
    
    let promises = []
    
    for(const fusion_key in fusions){ 
        if (fusions[fusion_key] !== ''){
            let fusion_from = fusions[fusion_key].split('_')
            promises.push(exports.createFusion(1, 
                Number(fusion_from[1]), fusion_from[0], //JOIN FROM
                Number(item.id), fusion_to //JOIN TO
                ))
        }
    }

    return  Promise.all(promises)
    .catch((err) =>{
        return
    })        
}

exports.createSectionFusionsFromBody = (report_id, report_body) => {

    let promises = []
    
    // for(const fusion_key in fusions){ 
    //     if (fusions[fusion_key] !== ''){
    //         let fusion_from = fusions[fusion_key].split('_')
    //         promises.push(exports.createFusion(1, 
    //             Number(fusion_from[1]), fusion_from[0], //JOIN FROM
    //             Number(item.id), fusion_to //JOIN TO
    //             ))
    //     }
    // }

    let sections = report_body

    //LOOP THROUGH SECTION KEYS
    for(const section_key in sections){ 
        let subsection_order = 1
        for(const subsection_key in sections[section_key]){ 
	        let subsection = sections[section_key][subsection_key]

            if (subsection_key.includes("Sub Section")){

                if(subsection.id !== ""){
                    promises.push(exports.createFusion(subsection_order, subsection.id, 'subsection', report_id, 'report'))

                    subsection_order++
                }
            }
        }
    }


    return  Promise.all(promises)
    .catch((err) =>{
        return
    })    

}



exports.recreateSubSectionFusions = (report_id, f_subsections) => {
    let promises = []
    //CREATE FUSIONS BASED ON NEW FUSION LIST
    f_subsections.forEach((subsection_id, i) => {
        promises.push(exports.createFusion(i+1, 
            Number(subsection_id), 'SubSection', //JOIN FROM
            Number(report_id), 'Report' //JOIN TO
            ))
    })    

    return  Promise.all(promises)
    .catch((err) =>{
        return
    })    
}

exports.getFusions = async(join_to_id, join_from, join_to) => {

    return fusions = Fusion.findAll({
        where: {
            join_to_id: join_to_id,
            join_to: join_to,
            join_from: join_from
        },
        order: [ [ 'order', 'ASC' ]]
    })
    .catch((err) =>{
        return
    })
}

exports.getFusions2 = async(search_data) => {

    //PASS SEARCH TERMS TO THE QUERY THEN HAVE IT EXECUTE INSTEAD OF REQUIRING RIGID SEARCH TERMS
    let data = {}
    data['where'] = {}
    for(const key in search_data){ 
        data['where'][key] = search_data[key]
    }
    data['order'] = [ [ 'order', 'ASC' ]]

    // console.log("test")

    return fusions = Fusion.findAll(data)
    .catch((err) =>{
        console.log(err)
        return
    })
}


//ADMIN FUNCTION
exports.getAllLinkedFusionData = (fusions) => {

    if(fusions && fusions.length > 0)
    {    
        let promises = [];
        fusions.forEach((fusion) => {
            let function_name = 'get' + fusion.join_from
            promises.push(exports[function_name](fusion.join_from_id))
        })

        return Promise.all(promises)
        .catch((err) =>{
            return
        })      
    }
    else {
        return
    }
}


//ADMIN FUNCTION
exports.getAllFusableData = (data_types) => {

    if(data_types && data_types.length > 0)
    {
        let promises = [];
        data_types.forEach((data_type) => {
            let function_name = 'getAll' + data_type + 's'
            promises.push(exports[function_name]())
        })

        return Promise.all(promises)
        .catch((err) =>{
            return
        })  
    }
    else {
        return
    }
}


// exports.destroyFusions = (report_id) => {
exports.destroyFusions = (join_to_id, join_from, join_to) => {    
    return fusions = Fusion.destroy({
        where: {
            join_to_id: join_to_id,
            join_to: join_to,
            join_from: join_from
        }
    })
    .catch((err) =>{
        return
    })       
}

exports.destroyFusionsByID = (id_list) => {    
    return fusions = Fusion.destroy({
        where: {
            id: id_list
        }
    })
    .catch((err) =>{
        return
    })       
}


exports.dropFusions = () => {
    return Fusion.drop()
    .catch((err) =>{
        return
    })        
}

///////////////////////////////////////////////////////////////////SECTIONS

exports.findOrCreate = (params) => {
    return Section.findOrCreate ({
        where : {
            order: params.order
            ,name: params.name
        }
    })       
    .catch((err) =>{
        return
    })      

}


///////////////////////////////////////////////////////////////////SUB SECTIONS

exports.createSubSection = (params) => {
    return SubSection.create ({
        path: params.path
		,name: params.name
		,description: params.description
	})       
}

exports.getSubSections = (fusions=[], all_subsections=true) => {
    let subsection_ids = [];
    fusions.forEach( 
        (fusion) => { 
            subsection_ids.push(fusion.join_from_id);
            // console.log(fusion)
        }
    )

    if (all_subsections === true){
        return subsections = SubSection.findAll()
        .catch((err) =>{
            return
        })           
    }
    else{
        return subsections = SubSection.findAll({
            where: {
                id: subsection_ids
            }
        })
        .catch((err) =>{
            return
        })           
    }    
}

exports.getSubSection = (subsection_id=-1, name="") => {

    if (subsection_id != -1){
        return SubSection.findByPk(subsection_id)  
        .catch((err) =>{
            return
        })           
    } else {
        return SubSection.findOne({
            where: {
                name: name
            }
        })          
        .catch((err) =>{
            return
        })           
    }
}

exports.deleteSubSection = (ids) => {
    return SubSection.destroy ({
        where : {
            id: ids
        }
    })
    .catch((err) =>{
        console.log(err)
        return
    })        
}

exports.dropSubSections = () => {
    return SubSection.drop()
    .catch((err) =>{
        return
    })          
}

///////////////////////////////////////////////////////////////////PARAMETERS

exports.createParameter = (params) => {
    return Parameter.create ({
		name: params.name
		,query: params.query
	})       
}

exports.dropParameters = () => {
    return Parameter.drop()
    .catch((err) =>{
        return
    })         
}

exports.getParameter = (parameter_id=-1, name="") => {

    if (parameter_id != -1){
        return Parameter.findByPk(parameter_id)  
        .catch((err) =>{
            return
        })           
    } else {
        return Parameter.findOne({
            where: {
                name: name
            }
        })          
        .catch((err) =>{
            return
        })           
    }
}

exports.onlyUnique = (value, index, self) => {
    return self.indexOf(value) === index;
}


exports.getParameters = (fusions=[], all_parameters=true) => {
    let parameter_ids = [];
    fusions.forEach( 
        (fusion) => { 
            parameter_ids.push(fusion.join_from_id);
            // console.log(fusion)
        }
    )

    if (all_parameters === true){
        return parameters = Parameter.findAll()
        .catch((err) =>{
            return
        })           
    }
    else{
        return parameters = Parameter.findAll({
            where: {
                id: parameter_ids
            }
        })
        .catch((err) =>{
            return
        })           
    }    
}

exports.getAllParameters = () => {
    return parameters = Parameter.findAll()
    .catch((err) =>{
        return
    })      
}


exports.getSubSectionParameters = async(fusions=[], unique_params_only=true) => {
    let parameter_ids = [];
    let subsection_ids = [];
    fusions.forEach( 
        (fusion) => { 
            subsection_ids.push(fusion.join_from_id);
        }
    )

    let parameter_fusions = await exports.getFusions(subsection_ids, "Parameter", "SubSection")

    parameter_fusions.forEach( 
        (fusion) => { 
            parameter_ids.push(fusion.join_from_id);
        }
    )

    if(unique_params_only === true){
        parameter_ids = parameter_ids.filter(exports.onlyUnique);
        // console.log(parameter_ids)
        return parameters = Parameter.findAll({
            where: {
                id: parameter_ids
            }
        }) 
        .catch((err) =>{
            return
        })           
    }
    else{
        let parameters = Parameter.findAll({
            where: {
                id: parameter_ids
            }
        })
        
        return Promise.all([parameter_fusions, parameters])
        .catch((err) =>{
            return
        })           
    }
}


exports.getSubscriptionParameters = async(report_id) => {

    let subsection_fusions = await exports.getFusions(report_id, "SubSection", "Report")

    //GET A UNIQUE LIST OF PARAMETERS
    let parameters = await exports.getSubSectionParameters(subsection_fusions);


    let dropdown_arrs = [];
    // dropdown_arrs.push(parameters);

    //RUN THROUGH EACH UNIQUE PARAMETER QUERY AND RETURN DROPDOWN INFORMATION AS A SET OF PROMISES
    parameters.forEach( 
        (parameter) => { 
            if (parameter.query !== ""){
                dropdown_arrs.push(Database.runQuery(parameter.query))    
            }else{
                dropdown_arrs.push([])
            }
        }
    )    

    //ONCE THE PROMISES ARE COMPLETE, RETURN AN ARRAY WITH THE PARAMETERS AND DROPDOWN VALUES
    return Promise.all(dropdown_arrs)
    .then((nestedpromises) => {
        return [parameters, nestedpromises];
    })
    .catch((err) =>{
        return
    })       

}


exports.deleteParameter = (ids) => {
    return Parameter.destroy ({
        where: {
            id: ids
        }
    })
    .catch((err) =>{
        return
    })        
}


///////////////////////////////////////////////////////////////////FULL REPORT

// used in report.show - produce a list of reports, fusions and all subsections (for dropdowns)
// 
exports.getFullReport = async(report_id, query_type) => {

    let report;
    let subsection_fusions;
    let subsections;
    let parameters;

    switch(query_type) {
        case "report, fusions, all subsections":

            try {
                report = Report.findByPk(report_id)
                subsection_fusions = await exports.getFusions(report_id, "SubSection", "Report")
                subsections = exports.getSubSections(subsection_fusions, all_subsections=true)
            
                return Promise.all([report, subsection_fusions, subsections])        
            }
            catch(err){
                return
            }
            break;
        case "report, fusions, subsections, parameters":

            report = Report.findByPk(report_id)
            subsection_fusions = await exports.getFusions(report_id, "SubSection", "Report")
            subsections = exports.getSubSections(subsection_fusions, all_subsections=false)

            parameters = await exports.getSubSectionParameters(subsection_fusions, false);

            // return Promise.all([parameters])

            return Promise.all([report, subsection_fusions, subsections])
            .then((values) => {
                return [values[0],values[1],values[2], parameters[0], parameters[1]]
            })        
            .catch((err) =>{
                return
            })               
            break;									
        default:
    }    
}


///////////////////////////////////////////////////////////////////FREQUENCY

exports.getAllFrequencies = () => {

    return Frequency.findAll({
        order: [ [ 'order', 'ASC' ]]
    })   
}

exports.getFrequency = (frequency_id=-1, name="") => {

    if (frequency_id != -1){
        return Frequency.findByPk(frequency_id)  
        .catch((err) =>{
            return
        })           
    } else {
        return Frequency.findOne({
            where: {
                name: name
            }
        })       
        .catch((err) =>{
            return
        })              
    }
}

exports.dropFrequencies = () => {
    return Frequency.drop()
    .catch((err) =>{
        return
    })         
}

///////////////////////////////////////////////////////////////////SUBSCRIPTIONS

exports.getSubscriptions = async(report_id, subscription_ids=[]) => {

    if (subscription_ids.length === 0)
    {
        return subscriptions = Subscription.findAll({
            where: {
                NODEReportId: report_id
            },
            include: [
                Frequency
               ],        
            order: [ [ 'name', 'ASC' ]]
        })
        .catch((err) =>{
            return
        })           
    } else {
        return subscriptions = Subscription.findAll({
            where: {
                NODEReportId: report_id,
                id: subscription_ids
            },
            include: [
                Frequency
               ],        
            order: [ [ 'name', 'ASC' ]]
        })     
        .catch((err) =>{
            return
        })              
    }
}

exports.getActiveSubscriptions = async(report_id) => {

    return subscriptions = Subscription.findAll({
        where: {
            NODEReportId: report_id,
            active: 1
        },
        include: [
            Frequency
           ],        
        order: [ [ 'name', 'ASC' ]]
    })     
    .catch((err) =>{
        return
    })   
}


exports.bulkUpdateSubscriptions = (subscriptions, values) => {

    let promises = []
    
    subscriptions.forEach((subscription) => {
        for(const key in values){ 
            subscription[key] = values[key]
        }

        promises.push(subscription.save()) 
    })

    return  Promise.all(promises)
    .catch((err) =>{
        return
    })   
}



exports.getSubscription = (subscription_id=-1, name="") => {

    if (subscription_id != -1){
        return Subscription.findByPk(subscription_id)  
        .catch((err) =>{
            return
        })           
    } else {
        return Subscription.findOne({
            where: {
                name: name
            }
        })      
        .catch((err) =>{
            return
        })               
    }
}


exports.destroySubscription = (subscription_ids) => {    
    return subscriptions = Subscription.destroy({
        where: {
            id: subscription_ids
        }
    })
    .catch((err) =>{
        return
    })       
}


exports.dropSubscriptions = () => {
    return Subscription.drop()
    .catch((err) =>{
        return
    })        
}


///////////////////////////////////////////////////////////////////SUBSCRIPTION ACTIVITY



exports.createSubscriptionActivity = (subscription, file_data) => {

    return SubscriptionActivity.create({
        path: file_data.folder_path  
        ,files_expected: file_data.files_needed
        ,subscription_id: subscription.id
    })
    .catch((err) =>{
        console.log(err)
        return
    })   
}


exports.getSubscriptionActivity= (id=-1, path="") => {

    if (id != -1){
        return SubscriptionActivity.findByPk(id)  
        .catch((err) =>{
            return
        })           
    } else {
        return SubscriptionActivity.findOne({
            where: {
                path: path
            }
        })          
        .catch((err) =>{
            console.log(err)
            return
        })           
    }
}