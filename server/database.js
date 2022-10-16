const mysql = require("mysql");
require("dotenv").config();

const connection = mysql.createConnection({
  host: "",
  database: "",
  user: "",
  password: "",
});
