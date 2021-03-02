const Sequelize = require("sequelize");
const database = require('../util/database')


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

module.exports = Report