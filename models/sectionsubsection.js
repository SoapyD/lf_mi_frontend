const Sequelize = require("sequelize");

const database = require('../util/database')

const Fusion = database.sequelize.define('NODE_REPORT_sectionsubsections', {
   id: {
       type: Sequelize.INTEGER,
       autoIncrement: true,
       allowNull: false,
       primaryKey: true
   },

   order: Sequelize.INTEGER   
});

module.exports = Fusion