const { Pool } = require("pg");


const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: String(process.env.DB_PASSWORD || ""),
  port: process.env.DB_PORT,
});


if (process.env.NODE_ENV !== "test") {
  pool.connect((err, client, release) => {
    if (err) {
      console.error("DB connection failed", err);
    } else {
      console.log("PostgreSQL connected");
      release();
    }
  });
}

module.exports = pool;