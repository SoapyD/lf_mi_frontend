const Sequelize = require("sequelize");
const utils = require('../utils')



const Data_Ownerteam = utils.database.sequelize.define('NODE_DATA_ownerteam', {
   id: {
       type: Sequelize.INTEGER,
       autoIncrement: true,
       allowNull: false,
       primaryKey: true
   },
    ownerteam: Sequelize.STRING,
    type: Sequelize.STRING,
    lf_resolver: Sequelize.BOOLEAN,    
});


module.exports = Data_Ownerteam