const Sequelize = require("sequelize");
const utils = require('../utils')



const DETAIL_PeopleHR_Employee = utils.database.sequelize.define('DETAIL_peoplehr_employee', {
    ID: Sequelize.INTEGER,
    EmployeeID: {
       type: Sequelize.STRING,
       allowNull: false,
       primaryKey: true
    },
	FirstName: Sequelize.STRING,
	LastName: Sequelize.STRING,
	Location: Sequelize.STRING,
	ReportsTo: Sequelize.STRING,
	Department: Sequelize.STRING,
    JobRole: Sequelize.STRING,
    
    StartDate: Sequelize.DATE,
    FinalDayofEmployment: Sequelize.DATE,
}, {
    timestamps: false,    
    freezeTableName: true, //PREVENTS SEQUELIZE ADDING AN 'S' ONTO TABLE NAMES
});


module.exports = DETAIL_PeopleHR_Employee