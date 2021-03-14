const Sequelize = require("sequelize");
// const moment = require("moment");
const database = require('../util/database')

// const Section = require("./section");

const Parameter = database.sequelize.define('NODE_REPORT_parameter', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    // table_type: {
    //     type: Sequelize.STRING,
    //     defaultValue: "Parameter" 
    // },
    order: Sequelize.FLOAT,
    name: Sequelize.STRING,
    query: Sequelize.STRING,
    visible: {type:Sequelize.BOOLEAN, defaultValue: 1}  
});



module.exports = Parameter