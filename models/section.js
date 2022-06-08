const Sequelize = require("sequelize");
const utils = require('../utils')



const Section = utils.database.sequelize.define('NODE_REPORT_section', {
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