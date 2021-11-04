const Sequelize = require("sequelize");
const utils = require('../utils')



const DIMENSION_Ownerteam = utils.database.sequelize.define('DIMENSION_ownerteam', {
    dim_Ownerteam_pk: {
       type: Sequelize.INTEGER,
       autoIncrement: true,
       allowNull: false,
       primaryKey: true
    },
    dim_Ownerteam_System: Sequelize.STRING,
    dim_Ownerteam_Orgunit: Sequelize.STRING,  
    dim_Ownerteam_Ownerteam: Sequelize.STRING,  
    dim_Ownerteam_cleaned: Sequelize.STRING,
    dim_Ownerteam_lf_resolver: Sequelize.STRING,
    dim_Ownerteam_finance_id: Sequelize.STRING
}, {
    freezeTableName: true, //PREVENTS SEQUELIZE ADDING AN 'S' ONTO TABLE NAMES
});


module.exports = DIMENSION_Ownerteam