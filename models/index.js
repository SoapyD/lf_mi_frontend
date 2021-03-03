
const models = {};
models.Parameter = require("./parameter");
models.SubSectionParameter = require("./subsectionparameter");
models.Report = require("./report");
models.Section = require("./section");
models.SectionSubSection = require("./sectionsubsection");
models.SubSection = require("./subsection");


models.Report.hasMany(models.Section, {as: 'sections', foreignKey: "reportId"});

models.Section.belongsTo(models.Report, {foreignKey: 'reportId'});
models.Section.belongsToMany(models.SubSection, {
  through: 'NODE_REPORT_sectionsubsections',
  as: 'subsections',
  foreignKey: 'sectionId',
  otherKey: 'subsectionId'
});

models.SectionSubSection.belongsTo(models.Section, {foreignKey: 'sectionId'})
models.SectionSubSection.belongsTo(models.SubSection, {foreignKey: 'subsectionId'})

models.SubSection.belongsToMany(models.Section, {
    through: 'NODE_REPORT_sectionsubsections',
    as: 'sections',
    foreignKey: 'subsectionId',
    otherKey: 'sectionId'
});


models.SubSection.belongsToMany(models.Parameter, {
  through: 'NODE_REPORT_subsectionparameters',
  as: 'parameters',
  foreignKey: 'subsectionId',
  otherKey: 'parameterId'
});

models.SubSectionParameter.belongsTo(models.SubSection, {foreignKey: 'subsectionId'})
models.SubSectionParameter.belongsTo(models.Parameter, {foreignKey: 'parameterId'})

models.Parameter.belongsToMany(models.SubSection, {
  through: 'NODE_REPORT_subsectionparameters',
  as: 'subsections',
  foreignKey: 'parameterId',
  otherKey: 'subsectionId'
});



module.exports = models