const Sequelize = require("sequelize");
const utils = require('../utils')



const DIMENSION_Measurement_Org_Measurements = utils.database.sequelize.define('DIMENSION_Measurement_Org_Measurements', {
    dim_measurement_org_measurements_pk: {
       type: Sequelize.INTEGER,
       autoIncrement: true,
       allowNull: false,
       primaryKey: true
    },
    dim_measurement_org_measurements_orgunit: Sequelize.STRING,
    dim_measurement_org_measurements_name: Sequelize.STRING,
    dim_measurement_org_measurements_rename: Sequelize.STRING,

    dim_measurement_org_measurements_target: Sequelize.DECIMAL(10, 2), 
    dim_measurement_org_measurements_target_string: Sequelize.STRING,
    dim_measurement_org_measurements_isservicecredit: Sequelize.INTEGER, 
    dim_measurement_org_measurements_type: Sequelize.STRING,
}, {
    timestamps: false,    
    freezeTableName: true, //PREVENTS SEQUELIZE ADDING AN 'S' ONTO TABLE NAMES
});


module.exports = DIMENSION_Measurement_Org_Measurements