import { Pool } from "pg"; 
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true, // disable SSL for local database server as local database has no SSL connection
});

export default pool;
 