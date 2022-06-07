const Sequelize = require("sequelize");
// const utils = require('../utils')

const SubSectionParameter = databaseHandler.sequelize.define('NODE_REPORT_subsectionparameters', {
   id: {
       type: Sequelize.INTEGER,
       autoIncrement: true,
       allowNull: false,
       primaryKey: true
   }
}, {
    timestamps: false,
 });

module.exports = SubSectionParameter