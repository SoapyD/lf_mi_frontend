const Sequelize = require("sequelize");
// const utils = require('../utils')



const DIMENSION_Orgunit_Contract = databaseHandler.sequelize.define('DIMENSION_orgunit_contract', {
    dim_orgunit_contract_pk: {
       type: Sequelize.INTEGER,
       autoIncrement: true,
       allowNull: false,
       primaryKey: true
    },
    dim_orgunit_contract_orgunit: Sequelize.STRING,
    dim_orgunit_contract_origin_type: Sequelize.STRING,
    dim_orgunit_contract_orgunit_business_central_code: Sequelize.STRING,
    dim_orgunit_contract_name: Sequelize.STRING,
    dim_orgunit_contract_business_central_subscription_code: Sequelize.STRING,
    dim_orgunit_contract_itsm: Sequelize.STRING,
    dim_orgunit_contract_start_date: Sequelize.DATE,
    dim_orgunit_contract_renewal_date: Sequelize.DATE,
    dim_orgunit_contract_max_renewal_date: Sequelize.DATE,
    dim_orgunit_contract_termination_date: Sequelize.DATE,
    dim_orgunit_contract_renewal_initial_term: Sequelize.INTEGER,
    dim_orgunit_contract_renewal_term: Sequelize.STRING,
    dim_orgunit_contract_total_renewal_term: Sequelize.STRING,
    dim_orgunit_contract_previous_supplier: Sequelize.STRING,
    dim_orgunit_contract_pdf_signed: Sequelize.STRING,
    dim_orgunit_contract_type: Sequelize.STRING,
    dim_orgunit_contract_payment_terms: Sequelize.STRING,
    dim_orgunit_contract_billing_cycle: Sequelize.STRING,
    dim_orgunit_contract_notice: Sequelize.STRING,
    dim_orgunit_contract_hours_of_service: Sequelize.STRING,
    dim_orgunit_primary_sector: Sequelize.STRING,
    dim_orgunit_secondary_sector: Sequelize.STRING,
    dim_orgunit_contract_variable_billing_flag: Sequelize.INTEGER,
}, {
    timestamps: false,    
    freezeTableName: true, //PREVENTS SEQUELIZE ADDING AN 'S' ONTO TABLE NAMES
});


module.exports = DIMENSION_Orgunit_Contract