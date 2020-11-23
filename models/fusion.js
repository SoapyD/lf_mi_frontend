const Sequelize = require("sequelize");

const database = require('../util/database')

// const Report = require("./report");
// const Section = require("./section");

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

// Fusion.belongsTo(Report);
// Fusion.belongsTo(Section);

module.exports = Fusion