const Sequelize = require("sequelize");
const sql = require('mssql')

exports.sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_SERVER,
    dialect: process.env.DB_TYPE,
    pool: {
      max: 5,
      min: 0,
      idle: 10000
    },
    dialectOptions: {
      encrypt: true
    },
    logging: false,
    
});



exports.config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  server: process.env.DB_SERVER, // You can use 'localhost\\instance' to connect to named instance
  database: process.env.DB_NAME,
}

exports.runQuery = async(query) => {
  // sql.connect() will return the existing global pool if it exists or create a new one if it doesn't
  return sql.connect(exports.config).then((pool) => {
    return pool.query(query)
  })
}


// module.exports = sequelize