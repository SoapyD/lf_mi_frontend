const Sequelize = require("sequelize");
// const utils = require('../utils')


const QueuedSubsection = databaseHandler.sequelize.define('NODE_REPORT_queuedsubsection', {
   id: {
       type: Sequelize.INTEGER,
       autoIncrement: true,
       allowNull: false,
       primaryKey: true
    //    ,unique: true
   }
   ,options: Sequelize.TEXT
}, {
   timestamps: false,
});

module.exports = QueuedSubsection