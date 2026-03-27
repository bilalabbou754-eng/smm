import mysql from "mysql2/promise";

let pool;

function getConfig() {
  const host = process.env.DB_HOST;
  const port = Number(process.env.DB_PORT || 3306);
  const user = process.env.DB_USER;
  const password = process.env.DB_PASSWORD;
  const database = process.env.DB_NAME;

  if (!host || !user || !database) {
    throw new Error("Missing MariaDB config. Set DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, and DB_NAME in .env.local.");
  }

  return {
    host,
    port,
    user,
    password,
    database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  };
}

export async function connectToDatabase() {
  if (!pool) {
    pool = mysql.createPool(getConfig());
  }

  return pool;
}

export async function getDb() {
  return connectToDatabase();
}
