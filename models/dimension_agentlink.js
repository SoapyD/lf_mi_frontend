const Sequelize = require("sequelize");
const utils = require('../utils')



const DIMENSION_Agentlink = utils.database.sequelize.define('DIMENSION_agent_link_v2', {
    dim_agent_link_pk: {
       type: Sequelize.INTEGER,
       autoIncrement: true,
       allowNull: false,
       primaryKey: true
    },
    dim_agentlink_ringcentral_login: Sequelize.STRING,
    dim_agentlink_system: Sequelize.STRING,  
    dim_agentlink_system_login: Sequelize.STRING,
    dim_agentlink_peoplehr_employee_id: Sequelize.STRING,
}, {
    timestamps: false,    
    freezeTableName: true, //PREVENTS SEQUELIZE ADDING AN 'S' ONTO TABLE NAMES
});


module.exports = DIMENSION_Agentlink