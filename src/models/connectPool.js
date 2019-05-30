const mysql = require('promise-mysql');
const config = require('../config')[process.env.NODE_ENV];

const { LOCAL_MYSQL_HOST, LOCAL_MYSQL_USER, LOCAL_MYSQL_PASSWORD, LOCAL_MYSQL_DATABASE } = config;

const getPool = mysql.createPool({
  connectionLimit: 3,
  host: LOCAL_MYSQL_HOST,
  user: LOCAL_MYSQL_USER,
  password: LOCAL_MYSQL_PASSWORD,
  database: LOCAL_MYSQL_DATABASE,
  timezone: 'utc'
});

module.exports = getPool;