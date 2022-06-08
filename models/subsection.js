const Sequelize = require("sequelize");
// const database = require('../util/database')
const utils = require('../utils')


const SubSection = utils.database.sequelize.define('NODE_REPORT_subsection', {
   id: {
       type: Sequelize.INTEGER,
       autoIncrement: true,
       allowNull: false,
       primaryKey: true
   },
   order: Sequelize.FLOAT,
   path: Sequelize.STRING,
//    path_warehouse: Sequelize.STRING,
//    path_snapshot: Sequelize.STRING,   
   name: Sequelize.STRING, 
   description: Sequelize.STRING,
   period_type: {type: Sequelize.STRING, defaultValue: "full"},
   type: {type: Sequelize.STRING, defaultValue: "normal"},
});

module.exports = SubSection