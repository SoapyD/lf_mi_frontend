const Sequelize = require("sequelize");
const database = require('../util/database')


const Section = database.sequelize.define('NODE_REPORT_section', {
   id: {
       type: Sequelize.INTEGER,
       autoIncrement: true,
       allowNull: false,
       primaryKey: true
   },
    order: Sequelize.INTEGER, 
    name: Sequelize.STRING,
});


module.exports = Section