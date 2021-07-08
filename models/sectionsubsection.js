const Sequelize = require("sequelize");

const utils = require('../utils')


const Fusion = utils.database.sequelize.define('NODE_REPORT_sectionsubsections', {
   id: {
       type: Sequelize.INTEGER,
       autoIncrement: true,
       allowNull: false,
       primaryKey: true
    //    ,unique: true
   },

   order: Sequelize.INTEGER
   ,name: Sequelize.STRING    
}, {
   timestamps: false,
});

module.exports = Fusion