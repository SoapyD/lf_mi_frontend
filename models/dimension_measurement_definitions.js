const Sequelize = require("sequelize");
const utils = require('../utils')



const DIMENSION_Measurement_Definitions = utils.database.sequelize.define('DIMENSION_Measurement_Definitions', {
    dim_measurement_definitions_pk: {
       type: Sequelize.INTEGER,
       autoIncrement: true,
       allowNull: false,
       primaryKey: true
    },

    dim_measurement_definitions_name: Sequelize.STRING,
    dim_measurement_definitions_type: {type: Sequelize.STRING, defaultValue: 'percentage higher than target'},
    dim_measurement_definitions_symbol: {type: Sequelize.STRING, defaultValue: '%'},    

}, {
    timestamps: false,    
    freezeTableName: true, //PREVENTS SEQUELIZE ADDING AN 'S' ONTO TABLE NAMES
});


module.exports = DIMENSION_Measurement_Definitions