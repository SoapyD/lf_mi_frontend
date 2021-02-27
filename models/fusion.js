const Sequelize = require("sequelize");

const database = require('../util/database')

const Fusion = database.sequelize.define('NODE_fusion', {
   id: {
       type: Sequelize.INTEGER,
       autoIncrement: true,
       allowNull: false,
       primaryKey: true
   },

   join_from_id: Sequelize.INTEGER,
   join_from: Sequelize.STRING,
   join_to_id: Sequelize.INTEGER,
   join_to: Sequelize.STRING,

   int_value: Sequelize.INTEGER,   
   string_value: Sequelize.STRING,
   order: Sequelize.INTEGER   
});

module.exports = Fusion