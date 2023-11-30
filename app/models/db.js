require("dotenv").config();
const Pool = require("pg").Pool;

const pool = new Pool({
  user: "admin_ecompjr",
  password: "EcompJr123@",
  host: process.env.SERVER_DATABASE,
  port: 5432,
  database: "postgres",
});

module.exports = pool;
