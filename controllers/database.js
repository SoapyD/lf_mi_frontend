const Report = require("../models/report");
const Fusion = require("../models/fusion");
const Section = require("../models/section");
const Subscription = require("../models/subscription");
const Frequency = require("../models/frequency");
const Parameter = require("../models/parameter");
const Database = require("../util/database");
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

exports.copyReport = async(report_id, result) => {

    let report = result[0];
    let section_fusions = result[1];
    let sections = result[2];
    let parameters = result[3];

    let new_report = await Report.create ({
        name: report.name + ' - Copy'
        ,description: report.description
    })

    let fusion_ids = []
    section_fusions.forEach((section, i) => {
        fusion_ids.push(section.join_from_id);
    })

    let new_section_fusions = exports.recreateSectionFusions(new_report.id, fusion_ids)

    return Promise.all([new_report, new_section_fusions])
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

    return Fusion.create({
        // NODEReportId: report_id
        // ,NODESectionId: section_id
        order: i      
        ,join_from_id: join_from_id
        ,join_from: join_from                                                  
        ,join_to_id: join_to_id
        ,join_to: join_to                                   
    })
    .catch((err) =>{
        return
    })   
}


exports.recreateSectionFusions = (report_id, f_sections) => {
    let processes = []
    //CREATE FUSIONS BASED ON NEW FUSION LIST
    f_sections.forEach((section_id, i) => {
        processes.push(exports.createFusion(i+1, 
            Number(section_id), 'section', //JOIN FROM
            Number(report_id), 'report' //JOIN TO
            ))
    })    

    return  Promise.all(processes)
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

exports.dropFusions = () => {
    return Fusion.drop()
    .catch((err) =>{
        return
    })        
}

///////////////////////////////////////////////////////////////////SECTIONS

exports.getSections = (fusions=[], all_sections=true) => {
    let section_ids = [];
    fusions.forEach( 
        (fusion) => { 
            section_ids.push(fusion.join_from_id);
            // console.log(fusion)
        }
    )

    // let sections;
    if (all_sections === true){
        return sections = Section.findAll()
        .catch((err) =>{
            return
        })           
    }
    else{
        return sections = Section.findAll({
            where: {
                id: section_ids
            }
        })
        .catch((err) =>{
            return
        })           
    }    
}

exports.getSection = (section_id=-1, name="") => {

    if (section_id != -1){
        return Section.findByPk(section_id)  
        .catch((err) =>{
            return
        })           
    } else {
        return Section.findOne({
            where: {
                name: name
            }
        })          
        .catch((err) =>{
            return
        })           
    }
}

exports.dropSections = () => {
    return Section.drop()
    .catch((err) =>{
        return
    })          
}

///////////////////////////////////////////////////////////////////PARAMETERS

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


exports.getSectionParameters = async(fusions=[], unique_params_only=true) => {
    let parameter_ids = [];
    let section_ids = [];
    fusions.forEach( 
        (fusion) => { 
            section_ids.push(fusion.join_from_id);
        }
    )

    let parameter_fusions = await exports.getFusions(section_ids, "parameter", "section")

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

    let section_fusions = await exports.getFusions(report_id, "section", "report")

    //GET A UNIQUE LIST OF PARAMETERS
    let parameters = await exports.getSectionParameters(section_fusions);


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

///////////////////////////////////////////////////////////////////FULL REPORT

// used in report.show - produce a list of reports, fusions and all sections (for dropdowns)
// 
exports.getFullReport = async(report_id, query_type) => {

    let report;
    let section_fusions;
    let sections;
    let parameters;

    switch(query_type) {
        case "report, fusions, all sections":

            try {
                report = Report.findByPk(report_id)
                section_fusions = await exports.getFusions(report_id, "section", "report")
                sections = exports.getSections(section_fusions, all_sections=true)
            
                return Promise.all([report, section_fusions, sections])        
            }
            catch(err){
                return
            }
            break;
        case "report, fusions, sections, parameters":

            report = Report.findByPk(report_id)
            section_fusions = await exports.getFusions(report_id, "section", "report")
            sections = exports.getSections(section_fusions, all_sections=false)

            parameters = await exports.getSectionParameters(section_fusions, false);

            // return Promise.all([parameters])

            return Promise.all([report, section_fusions, sections])
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


exports.destroySubscriptions = (subscription_ids) => {    
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