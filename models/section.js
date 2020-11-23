const Sequelize = require("sequelize");
const database = require('../util/database')
// const Report = require("../models/report");

const Section = database.sequelize.define('NODE_section', {
   id: {
       type: Sequelize.INTEGER,
       autoIncrement: true,
       allowNull: false,
       primaryKey: true
   },
   path: Sequelize.STRING,
   name: Sequelize.STRING,
   description: Sequelize.STRING
});

// Section.belongsTo(Report); // Will add companyId to user

module.exports = Section