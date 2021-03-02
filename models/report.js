const Sequelize = require("sequelize");
const database = require('../util/database')
// const Section = require("../models/section");

const Report = database.sequelize.define('NODE_REPORT_report', {
   id: {
       type: Sequelize.INTEGER,
       autoIncrement: true,
       allowNull: false,
       primaryKey: true
   },
   owner: Sequelize.STRING,
   name: Sequelize.STRING,
   description: Sequelize.STRING
});


// Report.associate = function(models) {
//     Report.hasMany(models.NODE_section) //, {foreignKey: 'reportId', as: 'report'})
// }
// Report.hasMany(Section)

module.exports = Report