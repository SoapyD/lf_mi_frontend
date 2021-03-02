
const models = {};
models.Report = require("./report");
models.Section = require("./section");
models.SectionSubSection = require("./sectionsubsection");
models.SubSection = require("./subsection");

models.Report.hasMany(models.Section, {as: 'sections'});

models.Section.belongsTo(models.Report, {foreignKey: 'NODEREPORTReportId'});
models.Section.belongsToMany(models.SubSection, {
    through: 'NODE_REPORT_sectionsubsections',
    as: 'subsections',
    foreignKey: 'NODEREPORTsectionId',
    otherKey: 'NODEREPORTsubsectionId'
  });

models.SectionSubSection.belongsTo(models.Section, {foreignKey: 'NODEREPORTsectionId'})
models.SectionSubSection.belongsTo(models.SubSection, {foreignKey: 'NODEREPORTsubsectionId'})


models.SubSection.belongsToMany(models.Section, {
    through: 'NODE_REPORT_sectionsubsections',
    as: 'sections',
    foreignKey: 'NODEREPORTsubsectionId',
    otherKey: 'NODEREPORTsectionId'
});

module.exports = models