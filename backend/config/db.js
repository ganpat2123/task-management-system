
const mysql = require("mysql2");

const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0,
  enableKeepAlive: true,

  ssl:
    process.env.DB_SSL === "true"
      ? { rejectUnauthorized: true }
      : undefined
});

db.query("SELECT 1", (error) => {
  if (error) {
    console.error(
      "Database connection error:",
      error.code || error.message
    );
  } else {
    console.log("Database connected successfully");
  }
});

module.exports = db;
