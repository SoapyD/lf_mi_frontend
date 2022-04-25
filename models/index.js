
const models = {};

//REPORT MODELS
models.Parameter = require("./parameter");
models.SubSectionParameter = require("./subsectionparameter");
models.Report = require("./report");
models.Section = require("./section");
models.SectionSubSection = require("./sectionsubsection");
models.SubSection = require("./subsection");
models.Subscription = require("./subscription");
models.Frequency = require("./frequency");
models.SubscriptionActivity = require("./subscriptionactivity");

models.QueuedSubsection = require("./queuedsubsection");
models.QueuedMerge = require("./queuedmerge");


//REPORT MODEL RELATIONSHIPS
models.Report.hasMany(models.Section, {as: 'sections', foreignKey: "reportId"});
models.Report.hasMany(models.Subscription, {as: 'subscriptions', foreignKey: "reportId"});

models.Section.belongsTo(models.Report, {foreignKey: 'reportId'});
models.Section.belongsToMany(models.SubSection,{
  through: {
    model: 'NODE_REPORT_sectionsubsections',
    unique: false
  },
  as: 'subsections',
  foreignKey: 'sectionId',
  constraints: false,
})

models.SectionSubSection.belongsTo(models.Section, {foreignKey: 'sectionId'})
models.SectionSubSection.belongsTo(models.SubSection, {foreignKey: 'subsectionId'})


models.SubSection.belongsToMany(models.Section, {
    through: {
      model: 'NODE_REPORT_sectionsubsections',
      unique: false
    },
    as: 'sections',
    foreignKey: 'subsectionId',
    constraints: false,
})



models.SubSection.belongsToMany(models.Parameter, {
  through: {
    model: 'NODE_REPORT_subsectionparameters',
    unique: false
  },
  as: 'parameters',
  foreignKey: 'subsectionId',
  constraints: false,
  // otherKey: 'parameterId',
});

models.SubSectionParameter.belongsTo(models.SubSection, {foreignKey: 'subsectionId', unique: false})
models.SubSectionParameter.belongsTo(models.Parameter, {foreignKey: 'parameterId', unique: false})

models.Parameter.belongsToMany(models.SubSection, {
  through: {
    model: 'NODE_REPORT_subsectionparameters',
    unique: false
  },
  as: 'subsections',
  foreignKey: 'parameterId',
  constraints: false,
  // otherKey: 'subsectionId',
});


models.Subscription.belongsTo(models.Report, {foreignKey: 'reportId'});
models.Subscription.belongsTo(models.Frequency, {as: 'frequency', foreignKey: "frequencyId"});
models.Subscription.hasMany(models.SubscriptionActivity, {as: 'subscriptionactivities', foreignKey: "subscriptionId"});

models.SubscriptionActivity.belongsTo(models.Subscription, {foreignKey: 'subscriptionId'});


models.QueuedSubsection.belongsTo(models.SubscriptionActivity, {foreignKey: 'subscriptionActivityId'});
models.QueuedMerge.belongsTo(models.SubscriptionActivity, {foreignKey: 'subscriptionActivityId'});



// #     #    #    ######  ####### #     # ####### #     #  #####  #######       #     # ####### ######  ####### #        #####  
// #  #  #   # #   #     # #       #     # #     # #     # #     # #             ##   ## #     # #     # #       #       #     # 
// #  #  #  #   #  #     # #       #     # #     # #     # #       #             # # # # #     # #     # #       #       #       
// #  #  # #     # ######  #####   ####### #     # #     #  #####  #####   ##### #  #  # #     # #     # #####   #        #####  
// #  #  # ####### #   #   #       #     # #     # #     #       # #             #     # #     # #     # #       #             # 
// #  #  # #     # #    #  #       #     # #     # #     # #     # #             #     # #     # #     # #       #       #     # 
//  ## ##  #     # #     # ####### #     # #######  #####   #####  #######       #     # ####### ######  ####### #######  #####  
                                                                                                                              

models.Dimension_Orgunit = require("./dimension_orgunit");
models.Dimension_Orgunit_Contract = require("./dimension_orgunit_contract");
models.Dimension_Ownerteam = require("./dimension_ownerteam");

models.DIMENSION_Measurement_Definitions = require("./dimension_measurement_definitions");
models.DIMENSION_Measurement_Org_Measurements = require("./dimension_measurement_org_measurements");

models.DETAIL_PeopleHR_Employee = require("./detail_peoplehr_employee");
models.Dimension_Agentlink = require("./dimension_agentlink");

//CLIENT DATA

//multiple contracts per orgunit
models.Dimension_Orgunit.hasMany(models.Dimension_Orgunit_Contract, {as: 'contracts', foreignKey: 'dim_orgunit_fk'});
models.Dimension_Orgunit_Contract.belongsTo(models.Dimension_Orgunit, {foreignKey: 'dim_orgunit_fk'});

//multiple ownerteams per orgunit
models.Dimension_Orgunit.hasMany(models.Dimension_Ownerteam, {as: 'ownerteams', foreignKey: 'dim_orgunit_fk'});
models.Dimension_Ownerteam.belongsTo(models.Dimension_Orgunit, {foreignKey: 'dim_orgunit_fk'});

//multple measurements per orgunit
models.Dimension_Orgunit.hasMany(models.DIMENSION_Measurement_Org_Measurements, {as: 'measurements', foreignKey: 'dim_orgunit_fk'});
models.DIMENSION_Measurement_Org_Measurements.belongsTo(models.Dimension_Orgunit, {foreignKey: 'dim_orgunit_fk'});

//each measurement has a single definition
models.DIMENSION_Measurement_Org_Measurements.belongsTo(models.DIMENSION_Measurement_Definitions, {as: 'definition', foreignKey: 'dim_measurement_definitions_fk'});


//USER DATA

//multiple agentlinks per employee
models.DETAIL_PeopleHR_Employee.hasMany(models.Dimension_Agentlink, {as: 'agentlinks', foreignKey: 'dim_agentlink_peoplehr_employee_id'});
models.Dimension_Agentlink.belongsTo(models.DETAIL_PeopleHR_Employee, {foreignKey: 'dim_agentlink_peoplehr_employee_id'});

//NEED TO UPDATE IMPORT METHOD FOR PEOPLE HR EMPLOYEE DATA SO THE TABLE IS'T DELETED THEN REBUILT, OTHERWISE THIS WON'T WORK

/**/


module.exports = models



