import { Pool } from "pg";
console.log(process.env.DATABASE_URL);
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false, // disable SSL for local database server as local database has no SSL connection
});

export default pool;
 