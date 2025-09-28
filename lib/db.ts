import { Pool } from "pg";
console.log(process.env.DATABASE_URL);
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false, // disable SSL for local database server as local database has no SSL connection
});

export default pool;
/*
import { Client } from "pg";

// Create a single client connection
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: false, // for local development
});
client manages a single connection where at a time only one database query is executable.
Pool manages multiple connection simulatenously
*/