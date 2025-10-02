import { envEnsure, envNumber } from "@/lib/env";
import { Pool } from "pg";

const pool = new Pool({
  user: envEnsure("DB_USER"),
  host: envEnsure("DB_HOST"),
  database: "postgres",
  password: envEnsure("DB_PASSWORD"),
  port: envNumber("DB_PORT") || 5432,
});

const createUsersTableQuery = `
  CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(32) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL
  );
`;

export async function initDb() {
  try {
    await pool.query(createUsersTableQuery);
    console.log("Users table is ready");
  } catch (err) {
    console.error("Error creating users table:", err);
    throw err;
  }
}

export default pool;
