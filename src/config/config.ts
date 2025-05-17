import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export default {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  hostUrl: process.env.HOST_URL || 'http://localhost:3000',
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
  weatherApi: {
    baseUrl:
      process.env.WEATHER_API_BASE_URL || 'http://api.weatherapi.com/v1/',
    apiKey: process.env.WEATHER_API_KEY || '',
  },
  email: {
    from: process.env.SMTP_EMAIL_FROM || 'weather@example.com',
    smtp: {
      host: process.env.SMTP_HOST || 'smtp.example.com',
      port: Number(process.env.SMTP_PORT) || 587,
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASSWORD || '',
      },
    },
  },
};
