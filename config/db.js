// config/db.js
const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',       // Your database host
  user: 'root',    // Your database username
  password: '123', // Your database password
  database: 'paramedix',   // Your database name
  connectionLimit: 10      // Adjust as needed
});

pool.getConnection((err, connection) => {
  if (err) {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('Database connection was closed.')
    }
    if (err.code === 'ER_CON_COUNT_ERROR') {
      console.error('Database has too many connections')
    }
    if (err.code === 'ECONNREFUSED') {
      console.error('Database connection was refused.')
    }
    if (err.code === 'ER_NOT_SUPPORTED_AUTH_MODE') {
        console.error('Authentication method not supported.  See previous instructions on resolving this.');
    }
  } else {
    console.log("Database Connected");
  }

  if (connection) connection.release()
  return
})

module.exports = pool;
