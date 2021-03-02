const Sequelize = require("sequelize");
const database = require('../util/database')


const Section = database.sequelize.define('NODE_section', {
   id: {
       type: Sequelize.INTEGER,
       autoIncrement: true,
       allowNull: false,
       primaryKey: true
   },
   table_type: {
        type: Sequelize.STRING,
        defaultValue: "Section" 
    }   
    ,order: Sequelize.INTEGER 
    ,name: Sequelize.STRING
});

module.exports = Section