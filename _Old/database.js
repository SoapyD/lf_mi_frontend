const Sequelize = require("sequelize");
const sql = require('mssql')


exports.sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_SERVER,
    dialect: process.env.DB_TYPE,
    pool: {
      max: 100,
      min: 0,
      idle: 10000,
      idleTimeoutMillis: 60000
    },
    dialectOptions: {
      // encrypt: true
      options: { 
        encrypt: true,
        useUTC: true,
        connectTimeout: 60000,
        // "requestTimeout": 300000 
        decimalNumbers: true,
      }
    },
    // The retry config if Deadlock Happened
    retry: {
      match: [/Deadlock/i],
      max: 3, // Maximum rety 3 times
      backoffBase: 1000, // Initial backoff duration in ms. Default: 100,
      backoffExponent: 1.5, // Exponent to increase backoff each try. Default: 1.1
    },

    logging: false,
    
});



exports.config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  server: process.env.DB_SERVER, // You can use 'localhost\\instance' to connect to named instance
  database: process.env.QUERY_DB_NAME,
}

exports.runQuery = async(query) => {
  // sql.connect() will return the existing global pool if it exists or create a new one if it doesn't
  return sql.connect(exports.config).then((pool) => {
    return pool.query(query)
  })
}

// module.exports = sequelize