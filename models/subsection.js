const Sequelize = require("sequelize");
const database = require('../util/database')
// const Report = require("../models/report");

const SubSection = database.sequelize.define('NODE_REPORT_subsection', {
   id: {
       type: Sequelize.INTEGER,
       autoIncrement: true,
       allowNull: false,
       primaryKey: true
   },
   table_type: {
        type: Sequelize.STRING,
        defaultValue: "SubSection" 
    },   
   path: Sequelize.STRING,
   name: Sequelize.STRING,
   description: Sequelize.STRING
});

module.exports = SubSection