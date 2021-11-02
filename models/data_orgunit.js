const Sequelize = require("sequelize");
const utils = require('../utils')



const Data_Orgunit = utils.database.sequelize.define('NODE_DATA_orgunit', {
   id: {
       type: Sequelize.INTEGER,
       autoIncrement: true,
       allowNull: false,
       primaryKey: true
   },
    name: Sequelize.STRING,
    sdm_id: Sequelize.STRING,
});


module.exports = Data_Orgunit