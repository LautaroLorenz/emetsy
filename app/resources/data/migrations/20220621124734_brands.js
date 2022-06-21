/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.up = function(knex) {
  return knex.schema
  .createTable('brands', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('model').notNullable();
    table.integer('connection_id').notNullable().references('id').inTable('connections');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema
    .dropTable("brands");
};
