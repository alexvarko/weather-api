import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('subscriptions', (table) => {
    table.increments('id').primary();
    table.string('email').notNullable();
    table.string('city').notNullable();
    table.enum('frequency', ['hourly', 'daily']).notNullable();
    table.boolean('confirmed').defaultTo(false);
    table.string('confirmation_token').unique();
    table.string('unsubscribe_token').unique();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    table.index(['email', 'city']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('subscriptions');
}