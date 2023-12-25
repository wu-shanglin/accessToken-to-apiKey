const mysql2 = require('mysql2')
const config = require("../config")
const db = mysql2.createConnection({
  host: config.db_host,
  user: config.db_user,
  password: config.db_password,
  database: config.db_database,
  port: config.db_port,
})

module.exports = db;