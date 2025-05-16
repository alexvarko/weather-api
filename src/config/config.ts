import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export default {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  database: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'postgres',
    },
    migrations: {
      directory: path.resolve(__dirname, '../database/migrations'),
      tableName: 'knex_migrations',
    },
  },
};
