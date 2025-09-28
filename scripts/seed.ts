import pool from '../lib/db';
import fs from 'fs';
import path from 'path';

// Main function to orchestrate the seeding process
async function main() {
  const shouldClean = process.argv.includes('--clean');
  
  if (shouldClean) {
    await cleanDatabase();
  }
  
  await seedTables();
}

// Function to clean existing data from tables
async function cleanDatabase() {
  const client = await pool.connect();
  console.log('🧹 Cleaning the database...');
  try {
    await client.query('BEGIN'); // Start transaction
    console.log('  -> Truncating "UserChallenges", "UserBadges", "Activities"...');
    // Note: List tables in order to avoid foreign key constraint issues
    await client.query('TRUNCATE TABLE "UserChallenges", "UserBadges", "Todos", "CarbonBudgets", "Activities" RESTART IDENTITY CASCADE');
    await client.query('COMMIT'); // Commit transaction
    console.log('✅ Database cleaned successfully.');
  } catch (error) {
    await client.query('ROLLBACK'); // Rollback on error
    console.error('❌ Error cleaning database:', error);
    throw error; // Re-throw error to stop the script
  } finally {
    client.release();
  }
}

// Function to seed all necessary tables
async function seedTables() {
  const client = await pool.connect();
  console.log('🌱 Seeding the database...');
  try {
    await client.query('BEGIN'); // Start transaction

    // Seed EmissionFactors
    console.log('  -> Seeding "EmissionFactors"...');
    const sqlFilePath = path.join(__dirname, '..', 'seed.sql');
    const sql = fs.readFileSync(sqlFilePath, 'utf8');
    await client.query(sql);

    // You could add other seeding logic here for other tables if needed

    await client.query('COMMIT'); // Commit transaction
    console.log('🚀 Database seeded successfully!');
  } catch (error) {
    await client.query('ROLLBACK'); // Rollback on error
    console.error('❌ Error seeding tables:', error);
    throw error; // Re-throw error to stop the script
  } finally {
    client.release();
  }
}

// Execute main function and handle final cleanup
main()
  .catch((err) => {
    console.error(
      'An error occurred while attempting to seed the database:',
      err,
    );
  })
  .finally(async () => {
    console.log('👋 Closing database connection pool.');
    await pool.end();
  });