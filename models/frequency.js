const Sequelize = require("sequelize");
const utils = require('../utils')


const Frequency = utils.database.sequelize.define('NODE_REPORT_frequency', {
   id: {
       type: Sequelize.INTEGER,
       autoIncrement: true,
       allowNull: false,
       primaryKey: true
   },
   name: Sequelize.STRING,
   description: Sequelize.STRING,   
   order: Sequelize.DECIMAL
});


module.exports = Frequency