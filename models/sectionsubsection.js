const Sequelize = require("sequelize");

const database = require('../util/database')

const Fusion = database.sequelize.define('NODE_REPORT_sectionsubsections', {
   id: {
       type: Sequelize.INTEGER,
       autoIncrement: true,
       allowNull: false,
       primaryKey: true
    //    ,unique: true
   },

   order: Sequelize.INTEGER
   ,name: Sequelize.STRING    
});

module.exports = Fusion