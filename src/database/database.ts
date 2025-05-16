import knex from 'knex';
import config from '#config/config';

export const db = knex(config.database);

export const runMigrations = async () => {
  try {
    console.log('Running database migrations...');
    await db.migrate.latest();
    console.log('Migrations completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
};