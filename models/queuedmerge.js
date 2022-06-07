const Sequelize = require("sequelize");
// const utils = require('../utils')


const QueuedMerge = databaseHandler.sequelize.define('NODE_REPORT_queuedmerge', {
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

module.exports = QueuedMerge