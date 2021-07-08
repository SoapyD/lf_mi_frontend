const Sequelize = require("sequelize");
const database = require('../util/database')

const SubscriptionActivity = database.sequelize.define('NODE_REPORT_subscriptionactivity', {
   id: {
       type: Sequelize.INTEGER,
       autoIncrement: true,
       allowNull: false,
       primaryKey: true
   }
   ,path: Sequelize.STRING
   ,running: {type:Sequelize.BOOLEAN, defaultValue: 1}   
   ,files_expected: {type:Sequelize.INTEGER, defaultValue: 0}
   ,files_current: {type:Sequelize.INTEGER, defaultValue: 0}
   ,errors: {type:Sequelize.INTEGER, defaultValue: 0}
   ,log: {type:Sequelize.TEXT, defaultValue: ''}
   ,contents_page: Sequelize.TEXT
});


module.exports = SubscriptionActivity