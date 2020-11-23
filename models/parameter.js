const Sequelize = require("sequelize");
// const moment = require("moment");
const database = require('../util/database')

// const Section = require("./section");

const Parameter = database.sequelize.define('NODE_parameter', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: Sequelize.STRING,
    query: Sequelize.STRING,    
});



module.exports = Parameter