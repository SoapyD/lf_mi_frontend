
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


models.SubscriptionActivity.belongsTo(models.Subscription, {foreignKey: 'subscriptionId'});



// models.Report.hasMany(models.Section, {as: 'sections', foreignKey: "reportId"});
// models.Section.belongsTo(models.Report, {foreignKey: 'reportId'});


//DATA MODELS

models.Dimension_Orgunit = require("./dimension_orgunit");
models.Dimension_Ownerteam = require("./dimension_ownerteam");

models.Dimension_Orgunit.hasMany(models.Dimension_Ownerteam, {as: 'ownerteams', foreignKey: 'dim_orgunit_fk'});
models.Dimension_Ownerteam.belongsTo(models.Dimension_Orgunit, {foreignKey: 'dim_orgunit_fk'});


module.exports = models



