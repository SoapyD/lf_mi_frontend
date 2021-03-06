const Sequelize = require("sequelize");
const moment = require("moment");

const database = require('../util/database')

const Report = require("./report");
const Frequency = require("./frequency");

const Subscription = database.sequelize.define('NODE_REPORT_subscription', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: Sequelize.STRING,
    start_date: {
        type: Sequelize.DATE,
        get: function() {
            // console.log(this.dataValues.start_date)
            if(this.dataValues.start_date === null){
                return undefined
            }else{
                return moment(this.dataValues.start_date).format('YYYY-MM-DD')
            }
            
        }
   },
    // time: Sequelize.TIME,   

    time: {
        type: Sequelize.TIME,
        get: function() {
            // return moment(this.dataValues.time).format('HH:MM')
            if(this.dataValues.time === null){
                return undefined
            }else{           
                return moment.utc(this.dataValues.time).format('HH:mm')
            }        
        }
   },

    active: {type: Sequelize.BOOLEAN, defaultValue: 1},
    parameters: Sequelize.STRING,
    email_to: Sequelize.STRING,
    subject: Sequelize.STRING,
    body: Sequelize.STRING   
});

// Subscription.belongsTo(Report);
// Subscription.belongsTo(Frequency);


module.exports = Subscription