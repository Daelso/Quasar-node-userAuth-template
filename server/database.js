const mysql = require("mysql2");
const { Sequelize } = require("sequelize");
require("dotenv").config();

//Contains connections for both generic mySQL for raw querying and the sequelize setup

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
  }
);

sequelize
  .authenticate()
  .then(() => console.log("Sequelize connected"))
  .catch((err) => console.log(err));

module.exports = { mysql: connection, sequelize };
