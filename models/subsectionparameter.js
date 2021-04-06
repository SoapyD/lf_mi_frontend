const Sequelize = require("sequelize");

const database = require('../util/database')

const SubSectionParameter = database.sequelize.define('NODE_REPORT_subsectionparameters', {
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