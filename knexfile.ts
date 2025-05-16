import type { Knex } from "knex";
import config from "./src/config/config";

const knexConfig: Knex.Config = {
  client: 'pg',
  connection: config.database.connection,
  migrations: config.database.migrations,
};

module.exports = knexConfig;
