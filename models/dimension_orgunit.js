const Sequelize = require("sequelize");
const utils = require('../utils')



const DIMENSION_Orgunit = utils.database.sequelize.define('DIMENSION_orgunit', {
    dim_orgunit_pk: {
       type: Sequelize.INTEGER,
       autoIncrement: true,
       allowNull: false,
       primaryKey: true
    },
    dim_orgunit_orgunit: Sequelize.STRING,
    dim_orgunit_has_telephony: Sequelize.INTEGER,  
    dim_orgunit_top_org_rank: Sequelize.INTEGER,
    dim_orgunit_startdate: Sequelize.DATE,
    dim_orgunit_numberofusers: Sequelize.INTEGER,

    dim_orgunit_supporting_pod: Sequelize.STRING,
    dim_orgunit_accountmanagername: Sequelize.STRING,
    dim_orgunit_servicedeliverymanager: Sequelize.STRING,
    dim_orgunit_smo_client: Sequelize.INTEGER,
    dim_orgunit_numberofdevices: Sequelize.INTEGER,

    dim_orgunit_corehours_start: Sequelize.INTEGER,
    dim_orgunit_corehours_end: Sequelize.INTEGER,
    dim_orgunit_aged_ticket_days: Sequelize.INTEGER,
    dim_orgunit_sql_decimal_rounding: Sequelize.DECIMAL,    

    dim_orgunit_businesscentral_id: Sequelize.STRING,
    dim_orgunit_businesscentral_number: Sequelize.STRING,
    dim_orgunit_corehours: Sequelize.STRING,

    dim_orgunit_telephony_answertime: Sequelize.INTEGER,
    dim_orgunit_telephony_target: Sequelize.DECIMAL,
    dim_orgunit_telephony_sla_amber: Sequelize.DECIMAL,

    dim_orgunit_session_answertime: Sequelize.INTEGER,
    dim_orgunit_session_target: Sequelize.DECIMAL,
    dim_orgunit_session_sla_amber: Sequelize.DECIMAL,      

}, {
    timestamps: false,
    freezeTableName: true, //PREVENTS SEQUELIZE ADDING AN 'S' ONTO TABLE NAMES
});


module.exports = DIMENSION_Orgunit