const Sequelize = require("sequelize");

const utils = require('../utils')


const QueuedReport = utils.database.sequelize.define('NODE_REPORT_queuedreport', {
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

module.exports = QueuedReport